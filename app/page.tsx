import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { WorkoutForm } from "@/components/workout-form"

export default function Home() {
  const headersList = headers()
  const userId = headersList.get("x-user-id")

  if (!userId) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Training Tracker</h1>
      <div className="grid gap-6">
        <WorkoutForm />
      </div>
    </div>
  )
}

