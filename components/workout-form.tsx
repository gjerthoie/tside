"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

export function WorkoutForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const response = await fetch("/api/workouts", {
      method: "POST",
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        date: formData.get("date"),
      }),
    })

    if (response.ok) {
      router.refresh()
      event.currentTarget.reset()
    }

    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Workout</CardTitle>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input name="title" placeholder="Workout Title" required />
          </div>
          <div className="space-y-2">
            <Textarea name="description" placeholder="Workout Description" />
          </div>
          <div className="space-y-2">
            <Input type="date" name="date" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled={loading}>{loading ? "Adding..." : "Add Workout"}</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

