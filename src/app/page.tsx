import WorkoutDayListClient from "@/components/WorkoutDayListClient";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary">Your Workout Days</h1>
        <p className="text-muted-foreground">Manage your custom workout routines.</p>
      </div>
      <WorkoutDayListClient />
    </div>
  );
}
