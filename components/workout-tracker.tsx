"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Exercise {
  id: string
  name: string
  sets: Array<{
    id: string
    reps: number
    weight: number
  }>
}

export function WorkoutTracker() {
  const router = useRouter()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(false)

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: "",
        sets: [
          {
            id: Math.random().toString(36).substr(2, 9),
            reps: 0,
            weight: 0,
          },
        ],
      },
    ])
  }

  const addSet = (exerciseId: string) => {
    setExercises(
      exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: [
                ...exercise.sets,
                {
                  id: Math.random().toString(36).substr(2, 9),
                  reps: 0,
                  weight: 0,
                },
              ],
            }
          : exercise,
      ),
    )
  }

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter((exercise) => exercise.id !== exerciseId))
  }

  const removeSet = (exerciseId: string, setId: string) => {
    setExercises(
      exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.filter((set) => set.id !== setId),
            }
          : exercise,
      ),
    )
  }

  const updateExercise = (exerciseId: string, name: string) => {
    setExercises(
      exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              name,
            }
          : exercise,
      ),
    )
  }

  const updateSet = (exerciseId: string, setId: string, reps: number, weight: number) => {
    setExercises(
      exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId
                  ? {
                      ...set,
                      reps,
                      weight,
                    }
                  : set,
              ),
            }
          : exercise,
      ),
    )
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const response = await fetch("/api/workouts", {
      method: "POST",
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        date: formData.get("date"),
        exercises: exercises,
      }),
    })

    if (response.ok) {
      router.refresh()
      router.push("/workouts")
    }

    setLoading(false)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <form onSubmit={onSubmit}>
        <CardHeader>
          <CardTitle>Log Workout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Workout Title</Label>
            <Input id="title" name="title" required placeholder="e.g., Morning Workout" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="How was your workout?" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="date" required defaultValue={new Date().toISOString().split("T")[0]} />
          </div>

          <div className="space-y-4">
            {exercises.map((exercise) => (
              <Card key={exercise.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Input
                      placeholder="Exercise name"
                      value={exercise.name}
                      onChange={(e) => updateExercise(exercise.id, e.target.value)}
                      required
                    />
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeExercise(exercise.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {exercise.sets.map((set) => (
                      <div key={set.id} className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Reps"
                          className="w-24"
                          value={set.reps || ""}
                          onChange={(e) =>
                            updateSet(exercise.id, set.id, Number.parseInt(e.target.value) || 0, set.weight)
                          }
                          required
                        />
                        <Input
                          type="number"
                          placeholder="Weight (kg)"
                          className="w-24"
                          value={set.weight || ""}
                          onChange={(e) =>
                            updateSet(exercise.id, set.id, set.reps, Number.parseInt(e.target.value) || 0)
                          }
                          required
                        />
                        {exercise.sets.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeSet(exercise.id, set.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => addSet(exercise.id)}>
                      Add Set
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button type="button" variant="outline" onClick={addExercise} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Exercise
          </Button>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading || exercises.length === 0} className="w-full">
            {loading ? "Saving..." : "Save Workout"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

