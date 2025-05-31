
"use client";

import { useEffect, useState } from 'react';
import type { WorkoutDay } from '@/lib/types';
import { useWorkoutDays } from '@/hooks/useWorkoutDays';
import { generateAiHint } from '@/data/predefined-exercises';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Dumbbell } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface TrainCarouselClientProps {
  dayId: string;
}

export default function TrainCarouselClient({ dayId }: TrainCarouselClientProps) {
  const { getWorkoutDayByIdQuery } = useWorkoutDays();
  const isMobile = useIsMobile(); // isMobile can be used for other responsive adjustments if needed
  const { data: day, isLoading: dayLoading, error: dayError } = getWorkoutDayByIdQuery(dayId);

  if (dayLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="flex justify-center items-center">
          <Skeleton className="h-[400px] w-full max-w-md" />
        </div>
      </div>
    );
  }

  if (dayError) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold mb-4 text-destructive">Error Loading Workout</h2>
        <p className="text-muted-foreground mb-6">{dayError.message}</p>
        <Button asChild variant="outline">
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    );
  }
  
  if (!day) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold mb-4">Workout Day Not Found</h2>
        <p className="text-muted-foreground mb-6">The requested workout day could not be found.</p>
        <Button asChild variant="outline">
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    );
  }
  
  if (day.exercises.length === 0) {
     return (
      <div className="text-center py-10">
        <Button variant="outline" size="sm" className="absolute top-4 left-4 m-4" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Days
          </Link>
        </Button>
        <h1 className="text-3xl font-headline font-bold text-primary mb-2">{day.name}</h1>
        <h2 className="text-2xl font-semibold mb-4 mt-8">No Exercises in This Workout Day</h2>
        <p className="text-muted-foreground mb-6">Add some exercises to this day to start training.</p>
        <Button asChild variant="default">
          <Link href={`/days/${day.id}/edit`}>Edit Workout Day</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto relative px-4 sm:px-6 lg:px-8">
      <Button variant="outline" size="sm" className="absolute top-0 left-0 -mt-12" asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Days
        </Link>
      </Button>
      <h1 className="text-4xl font-headline font-bold text-center mb-2 text-primary">{day.name}</h1>
      <p className="text-center text-muted-foreground mb-8">Swipe through your exercises. Good luck!</p>
      
      <Carousel className="w-full" opts={{ loop: true }}>
        <CarouselContent>
          {day.exercises.map((exercise, index) => (
            <CarouselItem key={exercise.instanceId}>
              <div className="p-1">
                <Card className="shadow-xl overflow-hidden">
                  <div className="relative w-full h-64 md:h-80 bg-muted">
                    <Image
                      src={`/assets/${exercise.exerciseId}.png`}
                      alt={exercise.name}
                      fill
                      style={{ objectFit: "cover" }}
                      data-ai-hint={generateAiHint(exercise.name)}
                      unoptimized
                    />
                  </div>
                  <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-headline flex items-center justify-center">
                      <Dumbbell className="mr-3 h-7 w-7 text-primary" />
                      {exercise.name}
                    </CardTitle>
                    <CardDescription className="text-lg">Exercise {index + 1} of {day.exercises.length}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center pb-6">
                    <div className="flex justify-around items-center text-2xl font-semibold">
                      <div>
                        <p className="text-sm font-normal text-muted-foreground">Sets</p>
                        <p className="text-primary">{exercise.sets}</p>
                      </div>
                      <div>
                        <p className="text-sm font-normal text-muted-foreground">Reps</p>
                        <p className="text-primary">{exercise.reps}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {day.exercises.length > 1 && (
          <>
            <CarouselPrevious className="ml-[-30px] md:ml-[-50px] text-primary border-primary hover:bg-primary/10" />
            <CarouselNext className="mr-[-30px] md:mr-[-50px] text-primary border-primary hover:bg-primary/10" />
          </> 
        )}
      </Carousel>
    </div>
  );
}
