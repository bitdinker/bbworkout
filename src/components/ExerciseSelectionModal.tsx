
"use client";

import { useState, useMemo } from 'react';
import type { PredefinedExercise } from '@/lib/types';
import { generateAiHint } from '@/data/predefined-exercises';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft } from 'lucide-react';

interface ExerciseSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onExerciseSelect: (exercise: PredefinedExercise) => void;
  allExercises: PredefinedExercise[];
}

export default function ExerciseSelectionModal({
  isOpen,
  onOpenChange,
  onExerciseSelect,
  allExercises,
}: ExerciseSelectionModalProps) {
  const [step, setStep] = useState<'bodyPart' | 'exerciseList'>('bodyPart');
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);

  const bodyParts = useMemo(() => {
    const parts = new Set(allExercises.map(ex => ex.bodyPart));
    return Array.from(parts).sort();
  }, [allExercises]);

  const exercisesForSelectedBodyPart = useMemo(() => {
    if (!selectedBodyPart) return [];
    return allExercises.filter(ex => ex.bodyPart === selectedBodyPart);
  }, [allExercises, selectedBodyPart]);

  const handleBodyPartSelect = (bodyPart: string) => {
    setSelectedBodyPart(bodyPart);
    setStep('exerciseList');
  };

  const handleExerciseAdd = (exercise: PredefinedExercise) => {
    onExerciseSelect(exercise);
    // Optional: Close modal or go back to body part selection after adding
    // For now, let's keep it open on the carousel, user can add more or go back
    // onOpenChange(false);
    // setStep('bodyPart');
    // setSelectedBodyPart(null);
  };

  const handleBack = () => {
    setStep('bodyPart');
    setSelectedBodyPart(null);
  };

  const handleClose = () => {
    setStep('bodyPart');
    setSelectedBodyPart(null);
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[80vw] max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {step === 'bodyPart' ? 'Select Body Part' : `Exercises for ${selectedBodyPart}`}
          </DialogTitle>
          <DialogDescription>
            {step === 'bodyPart'
              ? 'Choose a body part to see available exercises.'
              : 'Browse exercises and add them to your workout day.'}
          </DialogDescription>
        </DialogHeader>

        {step === 'bodyPart' && (
          <ScrollArea className="flex-grow">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
              {bodyParts.map(part => (
                <Button
                  key={part}
                  variant="outline"
                  className="h-20 text-base"
                  onClick={() => handleBodyPartSelect(part)}
                >
                  {part}
                </Button>
              ))}
            </div>
          </ScrollArea>
        )}

        {step === 'exerciseList' && selectedBodyPart && (
          <>
            <div className="px-4 pt-2">
               <Button variant="outline" size="sm" onClick={handleBack} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Body Parts
              </Button>
            </div>
            {exercisesForSelectedBodyPart.length > 0 ? (
              <Carousel className="w-full px-4 py-2 flex-grow" opts={{align: "start"}}>
                <CarouselContent className="-ml-4">
                  {exercisesForSelectedBodyPart.map(exercise => (
                    <CarouselItem key={exercise.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3">
                      <div className="p-2 h-full">
                        <Card className="h-full flex flex-col shadow-md hover:shadow-lg transition-shadow">
                          <CardHeader className="p-4">
                            <CardTitle className="text-base font-semibold truncate" title={exercise.name}>{exercise.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 flex-grow flex flex-col justify-between">
                            <div className="relative w-full aspect-[4/3] bg-muted rounded-md overflow-hidden mb-3">
                              <Image
                                src={`/assets/${exercise.id}.png`}
                                alt={exercise.name}
                                fill
                                style={{ objectFit: "cover" }}
                                data-ai-hint={generateAiHint(exercise.name)}
                                unoptimized
                              />
                            </div>
                            <Button size="sm" className="w-full mt-auto py-2 text-sm" onClick={() => handleExerciseAdd(exercise)}>
                              Add to Workout
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="ml-[-10px] sm:ml-0" />
                <CarouselNext className="mr-[-10px] sm:mr-0" />
              </Carousel>
            ) : (
               <p className="text-muted-foreground text-center p-4">No exercises found for {selectedBodyPart}.</p>
            )}
          </>
        )}
         <DialogFooter className="mt-auto p-4 border-t">
            <Button variant="outline" onClick={handleClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
