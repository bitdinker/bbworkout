
"use client";

import { useQuery, useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import type { WorkoutDay, DayExercise, PredefinedExercise } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

const WORKOUT_DAYS_QUERY_KEY = 'workoutDays';

async function fetchWorkoutDays(): Promise<WorkoutDay[]> {
  const response = await fetch('/api/workout-days');
  if (!response.ok) {
    throw new Error('Network response was not ok while fetching workout days.');
  }
  return response.json();
}

async function fetchWorkoutDayById(dayId: string): Promise<WorkoutDay | null> {
  if (!dayId) return null; // For new day creation scenario
  const response = await fetch(`/api/workout-days/${dayId}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Network response was not ok while fetching workout day ${dayId}.`);
  }
  return response.json();
}

async function createWorkoutDay(newDayData: { name: string, exercises: DayExercise[] }): Promise<WorkoutDay> {
  const response = await fetch('/api/workout-days', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newDayData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to create workout day' }));
    throw new Error(errorData.message || 'Failed to create workout day');
  }
  return response.json();
}

async function updateWorkoutDayOnServer(updatedDay: WorkoutDay): Promise<WorkoutDay> {
  const response = await fetch(`/api/workout-days/${updatedDay.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedDay),
  });
  if (!response.ok) {
     const errorData = await response.json().catch(() => ({ message: 'Failed to update workout day' }));
    throw new Error(errorData.message ||`Failed to update workout day ${updatedDay.id}`);
  }
  return response.json();
}

async function deleteWorkoutDayOnServer(dayId: string): Promise<void> {
  const response = await fetch(`/api/workout-days/${dayId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to delete workout day' }));
    throw new Error(errorData.message || `Failed to delete workout day ${dayId}`);
  }
}

export function useWorkoutDays() {
  const queryClient: QueryClient = useQueryClient();
  const { toast } = useToast();

  const { data: workoutDays = [], isLoading, error } = useQuery<WorkoutDay[], Error>({
    queryKey: [WORKOUT_DAYS_QUERY_KEY],
    queryFn: fetchWorkoutDays,
  });
  
  const getWorkoutDayByIdQuery = (dayId: string | undefined) => {
    return useQuery<WorkoutDay | null, Error>({
      queryKey: [WORKOUT_DAYS_QUERY_KEY, dayId],
      queryFn: () => dayId ? fetchWorkoutDayById(dayId) : Promise.resolve(null),
      enabled: !!dayId, // Only run query if dayId is provided
    });
  };


  const addWorkoutDayMutation = useMutation<WorkoutDay, Error, { name: string, exercises: DayExercise[] }>({
    mutationFn: createWorkoutDay,
    onSuccess: (newDay) => {
      queryClient.invalidateQueries({ queryKey: [WORKOUT_DAYS_QUERY_KEY] });
      // Optionally, optimistically update or setQueryData for the new day if needed immediately
      // queryClient.setQueryData([WORKOUT_DAYS_QUERY_KEY, newDay.id], newDay);
      toast({ title: "Day Created!", description: `"${newDay.name}" has been successfully created.` });
    },
    onError: (err) => {
      toast({ title: "Error Creating Day", description: err.message, variant: "destructive" });
    }
  });

  const updateWorkoutDayMutation = useMutation<WorkoutDay, Error, WorkoutDay>({
    mutationFn: updateWorkoutDayOnServer,
    onSuccess: (updatedDay) => {
      queryClient.invalidateQueries({ queryKey: [WORKOUT_DAYS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [WORKOUT_DAYS_QUERY_KEY, updatedDay.id] });
      // queryClient.setQueryData([WORKOUT_DAYS_QUERY_KEY, updatedDay.id], updatedDay);
      // queryClient.setQueryData<WorkoutDay[]>([WORKOUT_DAYS_QUERY_KEY], (oldData) => 
      //   oldData?.map(day => day.id === updatedDay.id ? updatedDay : day) || []
      // );
      toast({ title: "Day Updated!", description: `"${updatedDay.name}" has been successfully updated.` });
    },
     onError: (err) => {
      toast({ title: "Error Updating Day", description: err.message, variant: "destructive" });
    }
  });

  const deleteWorkoutDayMutation = useMutation<void, Error, string>({
    mutationFn: deleteWorkoutDayOnServer,
    onSuccess: (_, dayId) => {
      queryClient.invalidateQueries({ queryKey: [WORKOUT_DAYS_QUERY_KEY] });
      queryClient.removeQueries({ queryKey: [WORKOUT_DAYS_QUERY_KEY, dayId] });
      // queryClient.setQueryData<WorkoutDay[]>([WORKOUT_DAYS_QUERY_KEY], (oldData) => 
      //   oldData?.filter(day => day.id !== dayId) || []
      // );
      toast({ title: "Day Deleted", description: "The workout day has been deleted." });
    },
    onError: (err) => {
      toast({ title: "Error Deleting Day", description: err.message, variant: "destructive" });
    }
  });
  
  // Helper function to get a single day from the cached list if needed, primarily for non-reactive use
  // For reactive use in components, prefer getWorkoutDayByIdQuery
  const getWorkoutDayById = (id: string): WorkoutDay | undefined => {
    return workoutDays.find(day => day.id === id);
  };


  return {
    workoutDays, // The list of all days
    isLoadingWorkoutDays: isLoading,
    workoutDaysError: error,
    
    getWorkoutDayByIdQuery, // Use this for fetching/displaying a single day reactively

    addWorkoutDay: addWorkoutDayMutation.mutateAsync, // Expose mutateAsync for promise handling
    updateWorkoutDay: updateWorkoutDayMutation.mutateAsync,
    deleteWorkoutDay: deleteWorkoutDayMutation.mutate, // mutate is fine if not awaiting in component

    // The following direct manipulation functions are for local state management within forms,
    // before submitting to server. The server will be the source of truth.
    // These are now less relevant as form directly constructs the DayExercise objects.
    // Consider removing if not used for client-side only previews before save.
    
    // Kept for potential local UI updates if needed, but primarily for API interaction now.
    getWorkoutDayById, // Local cache lookup, use getWorkoutDayByIdQuery for fresh data
  };
}

// QueryProvider should be set up in layout.tsx or a similar root component
// Example for layout.tsx:
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// const queryClient = new QueryClient();
// <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
