"use client";

import type { WorkoutDay } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Play, Edit3, Trash2, Dumbbell } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface WorkoutDayCardProps {
  day: WorkoutDay;
  onDelete: (id: string) => void;
}

export default function WorkoutDayCard({ day, onDelete }: WorkoutDayCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary flex items-center">
          <Dumbbell className="mr-2 h-6 w-6" />
          {day.name}
        </CardTitle>
        <CardDescription>{day.exercises.length} exercises</CardDescription>
      </CardHeader>
      <CardContent>
        {day.exercises.length > 0 ? (
          <ul className="list-disc list-inside text-sm text-muted-foreground pl-1 space-y-1 max-h-32 overflow-y-auto">
            {day.exercises.slice(0, 5).map(ex => <li key={ex.instanceId} className="truncate">{ex.name}</li>)}
            {day.exercises.length > 5 && <li>...and {day.exercises.length - 5} more</li>}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No exercises added yet.</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the workout day "{day.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(day.id)} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/days/${day.id}/edit`}>
            <Edit3 className="mr-2 h-4 w-4" /> Edit
          </Link>
        </Button>
        <Button variant="default" size="sm" asChild>
          <Link href={`/days/${day.id}/train`}>
            <Play className="mr-2 h-4 w-4" /> Train
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
