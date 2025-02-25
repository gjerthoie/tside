import { WorkoutTracker } from "@/components/workout-tracker"

export default function NewWorkoutPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">New Workout</h1>
      <WorkoutTracker />
    </div>
  )
}

