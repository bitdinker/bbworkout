
import type { PredefinedExercise } from '@/lib/types';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\w-]+/g, '');
}

const exerciseListRaw: Array<{ id: string, name: string, bodyPart: string }> = [
  // Chest
  { id: 'che01', name: 'Bench Press Flat', bodyPart: 'Chest' },
  { id: 'che02', name: 'Bench Press Incline', bodyPart: 'Chest' },
  { id: 'che03', name: 'Bench Press Decline', bodyPart: 'Chest' },
  { id: 'che04', name: 'Close-Grip Bench Press', bodyPart: 'Chest' },
  { id: 'che05', name: 'Reverse-Grip Bench Press', bodyPart: 'Chest' },
  { id: 'che06', name: 'Dumbbell Press Flat', bodyPart: 'Chest' },
  { id: 'che07', name: 'Dumbbell Press Incline', bodyPart: 'Chest' },
  { id: 'che08', name: 'Dumbbell Press Decline', bodyPart: 'Chest' },
  { id: 'che09', name: 'Dumbbell Flyes Flat', bodyPart: 'Chest' },
  { id: 'che10', name: 'Dumbbell Flyes Incline', bodyPart: 'Chest' },
  { id: 'che11', name: 'Dumbbell Flyes Decline', bodyPart: 'Chest' },
  { id: 'che12', name: 'Dumbbell Pullover', bodyPart: 'Chest' },
  { id: 'che13', name: 'Chest Press Machine Flat', bodyPart: 'Chest' },
  { id: 'che14', name: 'Chest Press Machine Incline', bodyPart: 'Chest' },
  { id: 'che15', name: 'Pec Deck Machine', bodyPart: 'Chest' },
  { id: 'che16', name: 'Hammer Strength Press', bodyPart: 'Chest' },
  { id: 'che17', name: 'Cable Crossover High', bodyPart: 'Chest' },
  { id: 'che18', name: 'Cable Crossover Mid', bodyPart: 'Chest' },
  { id: 'che19', name: 'Cable Crossover Low', bodyPart: 'Chest' },
  { id: 'che20', name: 'Single Arm Cable Fly', bodyPart: 'Chest' },
  { id: 'che21', name: 'Cable Press', bodyPart: 'Chest' },
  { id: 'che22', name: 'Push-Up Standard', bodyPart: 'Chest' },
  { id: 'che23', name: 'Push-Up Incline', bodyPart: 'Chest' },
  { id: 'che24', name: 'Push-Up Decline', bodyPart: 'Chest' },
  { id: 'che25', name: 'Chest Dips', bodyPart: 'Chest' },

  // Shoulders
  { id: 'sho01', name: 'Overhead Press Barbell', bodyPart: 'Shoulders' },
  { id: 'sho02', name: 'Behind-the-Neck Press', bodyPart: 'Shoulders' },
  { id: 'sho03', name: 'Front Press', bodyPart: 'Shoulders' },
  { id: 'sho04', name: 'Seated Dumbbell Press', bodyPart: 'Shoulders' },
  { id: 'sho05', name: 'Standing Dumbbell Press', bodyPart: 'Shoulders' },
  { id: 'sho06', name: 'Dumbbell Lateral Raise', bodyPart: 'Shoulders' },
  { id: 'sho07', name: 'Dumbbell Front Raise', bodyPart: 'Shoulders' },
  { id: 'sho08', name: 'Dumbbell Rear Delt Fly', bodyPart: 'Shoulders' },
  { id: 'sho09', name: 'Arnold Press', bodyPart: 'Shoulders' },
  { id: 'sho10', name: 'Shoulder Press Machine', bodyPart: 'Shoulders' },
  { id: 'sho11', name: 'Lateral Raise Machine', bodyPart: 'Shoulders' },
  { id: 'sho12', name: 'Reverse Pec Deck', bodyPart: 'Shoulders' },
  { id: 'sho13', name: 'Cable Lateral Raise Front', bodyPart: 'Shoulders' },
  { id: 'sho14', name: 'Cable Lateral Raise Side', bodyPart: 'Shoulders' },
  { id: 'sho15', name: 'Cable Lateral Raise Rear', bodyPart: 'Shoulders' },
  { id: 'sho16', name: 'Cable Face Pull', bodyPart: 'Shoulders' },
  { id: 'sho17', name: 'Pike Push-Up', bodyPart: 'Shoulders' },
  { id: 'sho18', name: 'Handstand Push-Up', bodyPart: 'Shoulders' },

  // Biceps
  { id: 'bic01', name: 'Barbell Curl', bodyPart: 'Biceps' },
  { id: 'bic02', name: 'EZ-Bar Curl', bodyPart: 'Biceps' },
  { id: 'bic03', name: 'Drag Curl', bodyPart: 'Biceps' },
  { id: 'bic04', name: 'Reverse Curl', bodyPart: 'Biceps' },
  { id: 'bic05', name: 'Alternating Dumbbell Curl', bodyPart: 'Biceps' },
  { id: 'bic06', name: 'Hammer Curl', bodyPart: 'Biceps' },
  { id: 'bic07', name: 'Concentration Curl', bodyPart: 'Biceps' },
  { id: 'bic08', name: 'Zottman Curl', bodyPart: 'Biceps' },
  { id: 'bic09', name: 'Preacher Curl Machine', bodyPart: 'Biceps' },
  { id: 'bic10', name: 'Cable Curl', bodyPart: 'Biceps' },
  { id: 'bic11', name: 'Rope Hammer Curl', bodyPart: 'Biceps' },
  { id: 'bic12', name: 'Concentration Cable Curl', bodyPart: 'Biceps' },
  { id: 'bic13', name: 'Chin-Up', bodyPart: 'Biceps' },
  { id: 'bic14', name: 'Bar Isometric Hold', bodyPart: 'Biceps' },

  // Triceps
  { id: 'tri01', name: 'Close-Grip Bench Press', bodyPart: 'Triceps' },
  { id: 'tri02', name: 'Skull Crushers', bodyPart: 'Triceps' },
  { id: 'tri03', name: 'JM Press', bodyPart: 'Triceps' },
  { id: 'tri04', name: 'Overhead Dumbbell Extension', bodyPart: 'Triceps' },
  { id: 'tri05', name: 'Triceps Kickback', bodyPart: 'Triceps' },
  { id: 'tri06', name: 'Tate Press', bodyPart: 'Triceps' },
  { id: 'tri07', name: 'Triceps Pushdown Machine', bodyPart: 'Triceps' },
  { id: 'tri08', name: 'Assisted Dip Machine', bodyPart: 'Triceps' },
  { id: 'tri09', name: 'Rope Pushdown', bodyPart: 'Triceps' },
  { id: 'tri10', name: 'Straight Bar Pushdown', bodyPart: 'Triceps' },
  { id: 'tri11', name: 'Overhead Cable Extension Rope', bodyPart: 'Triceps' },
  { id: 'tri12', name: 'Overhead Cable Extension Bar', bodyPart: 'Triceps' },
  { id: 'tri13', name: 'Dips', bodyPart: 'Triceps' },
  { id: 'tri14', name: 'Bench Dips', bodyPart: 'Triceps' },
  { id: 'tri15', name: 'Diamond Push-Up', bodyPart: 'Triceps' },

  // Back
  { id: 'bac01', name: 'Deadlift', bodyPart: 'Back' },
  { id: 'bac02', name: 'Romanian Deadlift', bodyPart: 'Back' },
  { id: 'bac03', name: 'Bent Over Row', bodyPart: 'Back' },
  { id: 'bac04', name: 'Pendlay Row', bodyPart: 'Back' },
  { id: 'bac05', name: 'T-Bar Row', bodyPart: 'Back' },
  { id: 'bac06', name: 'Single Arm Dumbbell Row', bodyPart: 'Back' },
  { id: 'bac07', name: 'Chest-Supported Dumbbell Row', bodyPart: 'Back' },
  { id: 'bac08', name: 'Renegade Row', bodyPart: 'Back' },
  { id: 'bac09', name: 'Lat Pulldown', bodyPart: 'Back' },
  { id: 'bac10', name: 'Seated Cable Row', bodyPart: 'Back' },
  { id: 'bac11', name: 'Hammer Strength Row', bodyPart: 'Back' },
  { id: 'bac12', name: 'Cable Straight Arm Pulldown', bodyPart: 'Back' },
  { id: 'bac13', name: 'Low Pulley Row', bodyPart: 'Back' },
  { id: 'bac14', name: 'Pull-Up Wide', bodyPart: 'Back' },
  { id: 'bac15', name: 'Pull-Up Neutral', bodyPart: 'Back' },
  { id: 'bac16', name: 'Chin-Up', bodyPart: 'Back' },
  { id: 'bac17', name: 'Inverted Row', bodyPart: 'Back' },

  // Quads
  { id: 'qua01', name: 'Back Squat', bodyPart: 'Quads' },
  { id: 'qua02', name: 'Front Squat', bodyPart: 'Quads' },
  { id: 'qua03', name: 'Hack Squat Barbell', bodyPart: 'Quads' },
  { id: 'qua04', name: 'Zercher Squat', bodyPart: 'Quads' },
  { id: 'qua05', name: 'Goblet Squat', bodyPart: 'Quads' },
  { id: 'qua06', name: 'Bulgarian Split Squat', bodyPart: 'Quads' },
  { id: 'qua07', name: 'Dumbbell Step-Up', bodyPart: 'Quads' },
  { id: 'qua08', name: 'Leg Press', bodyPart: 'Quads' },
  { id: 'qua09', name: 'Hack Squat Machine', bodyPart: 'Quads' },
  { id: 'qua10', name: 'Leg Extension Machine', bodyPart: 'Quads' },
  { id: 'qua11', name: 'Cable Step-Up', bodyPart: 'Quads' },
  { id: 'qua12', name: 'Cable Leg Extension', bodyPart: 'Quads' },
  { id: 'qua13', name: 'Pistol Squat', bodyPart: 'Quads' },
  { id: 'qua14', name: 'Wall Sit', bodyPart: 'Quads' },
  { id: 'qua15', name: 'Jump Squat', bodyPart: 'Quads' },

  // Hamstrings
  { id: 'ham01', name: 'Romanian Deadlift', bodyPart: 'Hamstrings' },
  { id: 'ham02', name: 'Good Morning', bodyPart: 'Hamstrings' },
  { id: 'ham03', name: 'Dumbbell Romanian Deadlift', bodyPart: 'Hamstrings' },
  { id: 'ham04', name: 'Swiss Ball Dumbbell Curl', bodyPart: 'Hamstrings' },
  { id: 'ham05', name: 'Lying Leg Curl Machine', bodyPart: 'Hamstrings' },
  { id: 'ham06', name: 'Seated Leg Curl Machine', bodyPart: 'Hamstrings' },
  { id: 'ham07', name: 'Standing Leg Curl Machine', bodyPart: 'Hamstrings' },
  { id: 'ham08', name: 'Cable Leg Curl', bodyPart: 'Hamstrings' },
  { id: 'ham09', name: 'Glute-Ham Raise', bodyPart: 'Hamstrings' },
  { id: 'ham10', name: 'Nordic Curl', bodyPart: 'Hamstrings' },

  // Glutes
  { id: 'glu01', name: 'Hip Thrust Barbell', bodyPart: 'Glutes' },
  { id: 'glu02', name: 'Glute Bridge Barbell', bodyPart: 'Glutes' },
  { id: 'glu03', name: 'Sumo Deadlift', bodyPart: 'Glutes' },
  { id: 'glu04', name: 'Hip Thrust Dumbbell', bodyPart: 'Glutes' },
  { id: 'glu05', name: 'Glute Bridge Dumbbell', bodyPart: 'Glutes' },
  { id: 'glu06', name: 'Glute Kickback Machine', bodyPart: 'Glutes' },
  { id: 'glu07', name: 'Cable Glute Kickback', bodyPart: 'Glutes' },
  { id: 'glu08', name: 'Cable Pull-Through', bodyPart: 'Glutes' },

  // Calves
  { id: 'cal01', name: 'Standing Calf Raise Barbell', bodyPart: 'Calves' },
  { id: 'cal02', name: 'Seated Calf Raise Barbell', bodyPart: 'Calves' },
  { id: 'cal03', name: 'Standing Calf Raise Dumbbell', bodyPart: 'Calves' },
  { id: 'cal04', name: 'Single-Leg Calf Raise Dumbbell', bodyPart: 'Calves' },
  { id: 'cal05', name: 'Standing Calf Raise Machine', bodyPart: 'Calves' },
  { id: 'cal06', name: 'Seated Calf Raise Machine', bodyPart: 'Calves' },
  { id: 'cal07', name: 'Donkey Calf Raise Machine', bodyPart: 'Calves' },
  { id: 'cal08', name: 'Double-Leg Calf Raise', bodyPart: 'Calves' },
  { id: 'cal09', name: 'Single-Leg Calf Raise', bodyPart: 'Calves' },
  { id: 'cal10', name: 'Stair Calf Raise', bodyPart: 'Calves' },

  // Core / Abs
  { id: 'cor01', name: 'Crunch', bodyPart: 'Core / Abs' },
  { id: 'cor02', name: 'Leg Raise', bodyPart: 'Core / Abs' },
  { id: 'cor03', name: 'Plank', bodyPart: 'Core / Abs' },
  { id: 'cor04', name: 'V-Up', bodyPart: 'Core / Abs' },
  { id: 'cor05', name: 'Russian Twist', bodyPart: 'Core / Abs' },
  { id: 'cor06', name: 'Weighted Sit-Up', bodyPart: 'Core / Abs' },
  { id: 'cor07', name: 'Landmine Twist', bodyPart: 'Core / Abs' },
  { id: 'cor08', name: 'Overhead Carry', bodyPart: 'Core / Abs' },
  { id: 'cor09', name: 'Barbell Rollout', bodyPart: 'Core / Abs' },
  { id: 'cor10', name: 'Ab Crunch Machine', bodyPart: 'Core / Abs' },
  { id: 'cor11', name: 'Cable Ab Pulldown', bodyPart: 'Core / Abs' },
  { id: 'cor12', name: 'Cable Rope Crunch', bodyPart: 'Core / Abs' },
  { id: 'cor13', name: 'Cable Oblique Twist', bodyPart: 'Core / Abs' },
  { id: 'cor14', name: 'Cable Woodchopper', bodyPart: 'Core / Abs' },
];

export const PREDEFINED_EXERCISES: PredefinedExercise[] = exerciseListRaw.map((ex, index) => ({
  id: ex.id,
  name: ex.name,
  bodyPart: ex.bodyPart,
  // imageFilename: `${slugify(ex.name)}.png`,
  imageFilename: `${ex.id}.png`,
}));

export function generateAiHint(exerciseName: string): string {
  const words = exerciseName.toLowerCase().split(' ');
  if (words.length === 1) return words[0];
  if (words.length >= 2) return `${words[0]} ${words[1]}`;
  return "gym exercise"; // Fallback
}
