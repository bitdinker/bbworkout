
export interface PredefinedExercise {
  id: string;
  name: string;
  bodyPart: string;
  imageFilename: string; // e.g., "decline_dumbbell_presses.png"
  // data-ai-hint for image will be derived from name
}

export interface DayExercise {
  instanceId: string; // Unique ID for this specific exercise instance within the day
  exerciseId: string; // ID from PredefinedExercise
  name: string;
  bodyPart: string;
  reps: number;
  sets: number;
}

export interface WorkoutDay {
  id: string;
  name: string;
  dayOfWeek: string; // e.g., "Monday", "Tuesday", or "" if not set
  exercises: DayExercise[]; // Order in this array defines the workout sequence
}
