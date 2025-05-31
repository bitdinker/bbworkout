
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { WorkoutDay } from '@/lib/types';
import { useWorkoutDays } from '@/hooks/useWorkoutDays';
import WorkoutDayForm from '@/components/forms/WorkoutDayForm';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EditDayPageClientProps {
  dayId?: string;
}

export default function EditDayPageClient({ dayId }: EditDayPageClientProps) {
  const router = useRouter();
  const { getWorkoutDayByIdQuery } = useWorkoutDays();
  
  const { data: currentDay, isLoading: dayLoading, error: dayError } = getWorkoutDayByIdQuery(dayId);

  const handleSave = (savedDayData: WorkoutDay) => {
    router.push('/');
  };

  // Memoize initialData for a new day to prevent resetting form on parent re-renders
  const newDayInitialData = useMemo(() => ({ id: '', name: '', exercises: [] as WorkoutDay['exercises'] }), []);

  // Determine initialData for the form
  // If dayId is present and currentDay is loaded, use currentDay.
  // If dayId is not present (new day), use the memoized newDayInitialData.
  const initialData = dayId && currentDay ? currentDay : newDayInitialData;
  
  if (dayLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-10 w-1/3" />
      </div>
    );
  }

  if (dayError) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold mb-4 text-destructive">Error Loading Workout Day</h2>
        <p className="text-muted-foreground mb-6">{dayError.message}</p>
        <Button variant="outline" asChild>
          <Link href="/">Back to Days</Link>
        </Button>
      </div>
    );
  }

  if (dayId && !currentDay && !dayLoading && !dayError) {
     return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold mb-4">Workout Day Not Found</h2>
        <p className="text-muted-foreground mb-6">The workout day with ID "{dayId}" could not be found.</p>
        <Button variant="outline" asChild>
          <Link href="/">Back to Days</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
       <Button variant="outline" size="sm" className="mb-6" asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Days
        </Link>
      </Button>
      <h1 className="text-3xl font-headline font-bold mb-6 text-primary">
        {dayId && currentDay ? `Edit "${currentDay.name}"` : 'Create New Workout Day'}
      </h1>
      <WorkoutDayForm 
        initialData={initialData} 
        onSave={handleSave} 
        isEditing={!!dayId && !!currentDay}
        dayId={dayId}
      />
    </div>
  );
}

