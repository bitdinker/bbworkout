
"use client";

import { useState, useEffect } from 'react';
import type { WorkoutDay, DayExercise, PredefinedExercise } from '@/lib/types';
import { PREDEFINED_EXERCISES, generateAiHint } from '@/data/predefined-exercises';
import { useWorkoutDays } from '@/hooks/useWorkoutDays';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PlusCircle, Trash2, ArrowUp, ArrowDown, Save, ListPlus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";
import ExerciseSelectionModal from '@/components/ExerciseSelectionModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WorkoutDayFormProps {
  initialData?: Partial<WorkoutDay>; 
  onSave: (day: WorkoutDay) => void;
  isEditing: boolean;
  dayId?: string; 
}

const DAY_OF_WEEK_NOT_SET_OPTION_VALUE = "__NOT_SET__"; // Unique value for "Not Set" option

export default function WorkoutDayForm({ initialData, onSave, isEditing, dayId }: WorkoutDayFormProps) {
  const { toast } = useToast();
  const { addWorkoutDay: addWorkoutDayMutation, updateWorkoutDay: updateWorkoutDayMutation } = useWorkoutDays();

  const [dayName, setDayName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<DayExercise[]>([]);
  const [dayOfWeek, setDayOfWeek] = useState(''); 
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);

  useEffect(() => {
    setDayName(initialData?.name || '');
    setSelectedExercises(initialData?.exercises || []); 
    
    // Make sure we get the dayOfWeek value
    const dayWeekValue = initialData?.dayOfWeek || '';
    console.log('Initial dayOfWeek value:', dayWeekValue, initialData);
    setDayOfWeek(dayWeekValue);
  }, [initialData]);

  // Debug the current value of dayOfWeek state
  useEffect(() => {
    console.log('Current dayOfWeek state:', dayOfWeek);
  }, [dayOfWeek]);


  const handleAddExerciseFromModal = (predefinedExercise: PredefinedExercise) => {
    if (!predefinedExercise) return;

    const newExercise: DayExercise = {
      instanceId: crypto.randomUUID(),
      exerciseId: predefinedExercise.id,
      name: predefinedExercise.name,
      bodyPart: predefinedExercise.bodyPart,
      imageFilename: predefinedExercise.imageFilename,
      reps: 10,
      sets: 3,
    };
    setSelectedExercises(prev => [...prev, newExercise]);
    toast({ title: "Exercise Added", description: `"${predefinedExercise.name}" added to the list.` });
  };

  const handleRemoveExercise = (instanceId: string) => {
    setSelectedExercises(prev => prev.filter(ex => ex.instanceId !== instanceId));
  };

  const handleExerciseDetailChange = (instanceId: string, field: 'reps' | 'sets', value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0) return; 

    setSelectedExercises(prev =>
      prev.map(ex =>
        ex.instanceId === instanceId ? { ...ex, [field]: numValue } : ex
      )
    );
  };

  const handleReorderExercise = (instanceId: string, direction: 'up' | 'down') => {
    const index = selectedExercises.findIndex(ex => ex.instanceId === instanceId);
    if (index === -1) return;

    const newExercises = [...selectedExercises];
    if (direction === 'up' && index > 0) {
      [newExercises[index - 1], newExercises[index]] = [newExercises[index], newExercises[index - 1]];
    } else if (direction === 'down' && index < newExercises.length - 1) {
      [newExercises[index + 1], newExercises[index]] = [newExercises[index], newExercises[index + 1]];
    }
    setSelectedExercises(newExercises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dayName.trim()) {
      toast({ title: "Validation Error", description: "Day name cannot be empty.", variant: "destructive" });
      return;
    }

    try {
      let savedDay: WorkoutDay;
      if (isEditing && dayId) { 
        const dayToUpdate: WorkoutDay = { id: dayId, name: dayName, exercises: selectedExercises, dayOfWeek: dayOfWeek };
        savedDay = await updateWorkoutDayMutation(dayToUpdate);
      } else { 
        const newDayData = { name: dayName, exercises: selectedExercises, dayOfWeek: dayOfWeek };
        savedDay = await addWorkoutDayMutation(newDayData);
      }
      onSave(savedDay); 
    } catch (error) {
      console.error("Failed to save day:", error);
    }
  };
  
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Day Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dayName" className="font-semibold">Day Name</Label>
                <Input
                  id="dayName"
                  type="text"
                  value={dayName}
                  onChange={e => setDayName(e.target.value)}
                  placeholder="e.g., Monday Chest Day"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dayOfWeek" className="font-semibold">Day of Week</Label>
                <Select 
                  key={`day-select-${dayOfWeek || DAY_OF_WEEK_NOT_SET_OPTION_VALUE}`}
                  onValueChange={(value) => {
                    console.log('Select value changed to:', value);
                    if (value === DAY_OF_WEEK_NOT_SET_OPTION_VALUE) {
                      setDayOfWeek('');
                    } else {
                      setDayOfWeek(value);
                    }
                  }} 
                  value={dayOfWeek || DAY_OF_WEEK_NOT_SET_OPTION_VALUE} // Use NOT_SET if dayOfWeek is empty
                  defaultValue={dayOfWeek || DAY_OF_WEEK_NOT_SET_OPTION_VALUE}
                >
                  <SelectTrigger id="dayOfWeek" className="mt-1">
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DAY_OF_WEEK_NOT_SET_OPTION_VALUE}>Not Set</SelectItem>
                    <SelectItem value="Monday">Monday</SelectItem>
                    <SelectItem value="Tuesday">Tuesday</SelectItem>
                    <SelectItem value="Wednesday">Wednesday</SelectItem>
                    <SelectItem value="Thursday">Thursday</SelectItem>
                    <SelectItem value="Friday">Friday</SelectItem>
                    <SelectItem value="Saturday">Saturday</SelectItem>
                    <SelectItem value="Sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Add Exercises</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button type="button" variant="secondary" onClick={() => setIsExerciseModalOpen(true)} className="w-full">
              <ListPlus className="mr-2 h-4 w-4" /> Browse and Add Exercises
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Selected Exercises ({selectedExercises.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedExercises.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No exercises added yet. Click "Browse and Add Exercises" above.</p>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <ul className="space-y-4">
                  {selectedExercises.map((exercise, index) => (
                    <li key={exercise.instanceId} className="p-4 border rounded-lg bg-card shadow-sm flex flex-col space-y-3">
                      <div className="flex items-start space-x-4">
                        <Image
                          src={`https://placehold.co/80x80.png`}
                          alt={exercise.name}
                          width={80}
                          height={80}
                          className="rounded-md object-cover"
                          data-ai-hint={generateAiHint(exercise.name)}
                        />
                        <div className="flex-grow space-y-2">
                          <h4 className="font-semibold text-lg">{exercise.name}</h4>
                          <p className="text-xs text-muted-foreground">{exercise.bodyPart}</p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            <div>
                              <Label htmlFor={`sets-${exercise.instanceId}`} className="text-xs">Sets</Label>
                              <Input
                                id={`sets-${exercise.instanceId}`}
                                type="number"
                                min="0"
                                value={exercise.sets}
                                onChange={e => handleExerciseDetailChange(exercise.instanceId, 'sets', e.target.value)}
                                className="h-8 mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`reps-${exercise.instanceId}`} className="text-xs">Reps</Label>
                              <Input
                                id={`reps-${exercise.instanceId}`}
                                type="number"
                                min="0"
                                value={exercise.reps}
                                onChange={e => handleExerciseDetailChange(exercise.instanceId, 'reps', e.target.value)}
                                className="h-8 mt-1" 
                              /> 
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end items-center space-x-2 pt-2 border-t mt-3">
                         <span className="text-sm text-muted-foreground mr-auto">Order: {index + 1}</span>
                         <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleReorderExercise(exercise.instanceId, 'up')}
                          disabled={index === 0}
                          aria-label="Move up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleReorderExercise(exercise.instanceId, 'down')}
                          disabled={index === selectedExercises.length - 1}
                          aria-label="Move down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveExercise(exercise.instanceId)}
                          aria-label="Remove exercise"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg">
            <Save className="mr-2 h-5 w-5" />
            {isEditing ? 'Save Changes' : 'Create Day'}
          </Button>
        </div>
      </form>
      <ExerciseSelectionModal
        isOpen={isExerciseModalOpen}
        onOpenChange={setIsExerciseModalOpen}
        onExerciseSelect={handleAddExerciseFromModal}
        allExercises={PREDEFINED_EXERCISES}
      />
    </>
  );
}
