
"use client";

import Link from 'next/link';
import { useWorkoutDays } from '@/hooks/useWorkoutDays';
import WorkoutDayCard from '@/components/WorkoutDayCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle } from 'lucide-react';

export default function WorkoutDayListClient() {
  const { workoutDays, isLoadingWorkoutDays, deleteWorkoutDay, workoutDaysError } = useWorkoutDays();

  if (isLoadingWorkoutDays) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (workoutDaysError) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-destructive/50 rounded-lg bg-destructive/10">
        <h2 className="text-xl font-semibold text-destructive">Error Loading Workout Days</h2>
        <p className="text-destructive/80 mb-4">{workoutDaysError.message}</p>
        <p className="text-muted-foreground">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/days/new/edit">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Day
          </Link>
        </Button>
      </div>
      {workoutDays.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-muted-foreground/50 rounded-lg">
          <h2 className="text-xl font-semibold text-muted-foreground">No Workout Days Yet!</h2>
          <p className="text-muted-foreground">Click "Create New Day" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workoutDays.map(day => (
            <WorkoutDayCard key={day.id} day={day} onDelete={deleteWorkoutDay} />
          ))}
        </div>
      )}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <div className="flex justify-end space-x-2 pt-4">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  )
}
