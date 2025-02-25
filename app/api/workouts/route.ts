import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const headersList = headers()
    const userId = headersList.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const json = await req.json()
    const workout = await prisma.workout.create({
      data: {
        title: json.title,
        description: json.description,
        date: new Date(json.date),
        userId: userId,
        exercises: {
          create: json.exercises.map((exercise: any) => ({
            name: exercise.name,
            sets: {
              create: exercise.sets.map((set: any) => ({
                reps: set.reps,
                weight: set.weight,
              })),
            },
          })),
        },
      },
    })

    return NextResponse.json(workout)
  } catch (error) {
    return NextResponse.json({ error: "Error creating workout" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const headersList = headers()
    const userId = headersList.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const workouts = await prisma.workout.findMany({
      where: { userId },
      include: {
        exercises: {
          include: {
            sets: true,
          },
        },
      },
      orderBy: { date: "desc" },
    })

    return NextResponse.json(workouts)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching workouts" }, { status: 500 })
  }
}

