
import { NextResponse, type NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import type { WorkoutDay, DayExercise } from '@/lib/types';

interface RouteParams {
  params: { dayId: string };
}

async function getWorkoutDayFromDb(dayId: string, db: Awaited<ReturnType<typeof getDb>>): Promise<WorkoutDay | null> {
  const dayRaw = await db.get<WorkoutDay & { exercises_json?: string }>(`
    SELECT 
      wd.id, 
      wd.name,
      wd.dayOfWeek,
      (SELECT json_group_array(
                json_object(
                  'instanceId', de.instanceId, 
                  'exerciseId', de.exerciseId, 
                  'name', de.name,
                  'bodyPart', de.bodyPart,
                  'imageFilename', de.imageFilename,
                  'reps', de.reps,
                  'sets', de.sets,
                  'sort_order', de.sort_order
                )
              )
       FROM day_exercises de 
       WHERE de.workout_day_id = wd.id 
       ORDER BY de.sort_order ASC
      ) as exercises_json
    FROM workout_days wd
    WHERE wd.id = ?;
  `, dayId);

  if (!dayRaw) {
    return null;
  }
  
  const day: WorkoutDay = {
    id: dayRaw.id,
    name: dayRaw.name,
    dayOfWeek: typeof dayRaw.dayOfWeek === 'string' ? dayRaw.dayOfWeek : '', // Ensure dayOfWeek is always a string
    exercises: dayRaw.exercises_json ? JSON.parse(dayRaw.exercises_json).sort((a: DayExercise,b: DayExercise) => a.sort_order - b.sort_order) : []
  };
  return day;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { dayId } = params;
  try {
    const db = await getDb();
    const day = await getWorkoutDayFromDb(dayId, db);

    if (!day) {
      return NextResponse.json({ message: 'Workout day not found' }, { status: 404 });
    }
    
    return NextResponse.json(day);
  } catch (error) {
    console.error(`Failed to fetch workout day ${dayId}:`, error);
    return NextResponse.json({ message: 'Failed to fetch workout day', error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { dayId } = params;
  const db = await getDb(); // Get DB instance early for potential rollback

  try {
    const { name, exercises = [], dayOfWeek = "" } = await request.json() as WorkoutDay;

    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }
    
    await db.run('BEGIN TRANSACTION;');
    const updateResult = await db.run('UPDATE workout_days SET name = ?, dayOfWeek = ? WHERE id = ?', name, dayOfWeek, dayId);

    if (updateResult.changes === 0) {
      await db.run('ROLLBACK;');
      return NextResponse.json({ message: 'Workout day not found or no changes made' }, { status: 404 });
    }

    // Clear existing exercises for this day and re-insert
    await db.run('DELETE FROM day_exercises WHERE workout_day_id = ?', dayId);
    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];
      await db.run(
        'INSERT INTO day_exercises (instanceId, workout_day_id, exerciseId, name, bodyPart, imageFilename, reps, sets, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        ex.instanceId || crypto.randomUUID(), // Ensure instanceId
        dayId,
        ex.exerciseId,
        ex.name,
        ex.bodyPart,
        ex.imageFilename,
        ex.reps,
        ex.sets,
        i 
      );
    }
    await db.run('COMMIT;');

    // Re-fetch the updated day from the database to ensure consistency
    const updatedDayFromDb = await getWorkoutDayFromDb(dayId, db);
    if (!updatedDayFromDb) {
        // This should ideally not happen if the update was successful
        console.error(`Failed to re-fetch workout day ${dayId} after update.`);
        return NextResponse.json({ message: 'Workout day updated, but failed to retrieve updated record.' }, { status: 500 });
    }

    return NextResponse.json(updatedDayFromDb);

  } catch (error) {
    await db.run('ROLLBACK;').catch(rollbackError => console.error('Rollback failed:', rollbackError));
    console.error(`Failed to update workout day ${dayId}:`, error);
    return NextResponse.json({ message: 'Failed to update workout day', error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { dayId } = params;
  try {
    const db = await getDb();
    // ON DELETE CASCADE will handle deleting associated day_exercises
    const result = await db.run('DELETE FROM workout_days WHERE id = ?', dayId);

    if (result.changes === 0) {
      return NextResponse.json({ message: 'Workout day not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Workout day deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete workout day ${dayId}:`, error);
    return NextResponse.json({ message: 'Failed to delete workout day', error: (error as Error).message }, { status: 500 });
  }
}
