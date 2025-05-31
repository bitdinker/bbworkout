
import { NextResponse, type NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import type { WorkoutDay, DayExercise } from '@/lib/types';

// Extended type for DB result that includes sort_order
interface DayExerciseWithSortOrder extends DayExercise {
  sort_order: number;
}

export async function GET() {
  try {
    const db = await getDb();
    const daysRaw = await db.all<Array<WorkoutDay & { exercises_json?: string }>>(`
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
      ORDER BY wd.name ASC;
    `);

    const days = daysRaw.map(day => ({
      ...day,
      exercises: day.exercises_json ? 
        JSON.parse(day.exercises_json)
          .sort((a: DayExerciseWithSortOrder, b: DayExerciseWithSortOrder) => a.sort_order - b.sort_order)
          .map(({sort_order, ...exercise}: DayExerciseWithSortOrder) => exercise) // Remove sort_order from the final exercises
        : [],
      dayOfWeek: day.dayOfWeek || '', // Ensure dayOfWeek is always a string
    }));
    
    return NextResponse.json(days);
  } catch (error) {
    console.error('Failed to fetch workout days:', error);
    return NextResponse.json({ message: 'Failed to fetch workout days', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, exercises = [], dayOfWeek = "" } = await request.json() as Partial<WorkoutDay & {id?: string}>;

    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }

    const db = await getDb();
    const newDayId = crypto.randomUUID();

    await db.run('BEGIN TRANSACTION;');
    await db.run('INSERT INTO workout_days (id, name, dayOfWeek) VALUES (?, ?, ?)', newDayId, name, dayOfWeek);

    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];
      await db.run(
        'INSERT INTO day_exercises (instanceId, workout_day_id, exerciseId, name, bodyPart, imageFilename, reps, sets, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        ex.instanceId || crypto.randomUUID(), // Ensure instanceId if not provided
        newDayId,
        ex.exerciseId,
        ex.name,
        ex.bodyPart,
        ex.imageFilename,
        ex.reps,
        ex.sets,
        i // Use array index for sort_order
      );
    }
    await db.run('COMMIT;');

    const newDay: WorkoutDay = { id: newDayId, name, exercises, dayOfWeek };
    return NextResponse.json(newDay, { status: 201 });

  } catch (error) {
    const db = await getDb();
    await db.run('ROLLBACK;').catch(rollbackError => console.error('Rollback failed:', rollbackError));
    console.error('Failed to create workout day:', error);
    return NextResponse.json({ message: 'Failed to create workout day', error: (error as Error).message }, { status: 500 });
  }
}
