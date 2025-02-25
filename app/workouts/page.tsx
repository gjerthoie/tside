import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"

async function getWorkouts() {
  const headersList = headers()
  const userId = headersList.get("x-user-id")

  if (!userId) {
    redirect("/login")
  }

  return await prisma.workout.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    include: { exercises: true },
  })
}

export default async function WorkoutsPage() {
  const workouts = await getWorkouts()

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Workouts</h1>
        <Button asChild>
          <Link href="/workouts/new">
            <Plus className="h-4 w-4 mr-2" />
            New Workout
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workouts.map((workout) => (
          <Card key={workout.id}>
            <CardHeader>
              <CardTitle>{workout.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{new Date(workout.date).toLocaleDateString()}</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{workout.description}</p>
              <div className="space-y-2">
                {workout.exercises.map((exercise) => (
                  <div key={exercise.id} className="text-sm">
                    <strong>{exercise.name}</strong>
                    <div className="text-muted-foreground">{exercise.sets.length} sets</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {workouts.length === 0 && (
        <div className="text-center text-muted-foreground">No workouts yet. Start by creating a new workout!</div>
      )}
    </div>
  )
}

