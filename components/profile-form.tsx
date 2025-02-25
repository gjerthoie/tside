"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface User {
  id: string
  name: string | null
  email: string
  dateOfBirth: Date | null
  profileImage: string
}

export function ProfileForm({ user }: { user: User }) {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const response = await fetch("/api/profile", {
      method: "PUT",
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        dateOfBirth: formData.get("dateOfBirth"),
        password: formData.get("password"),
      }),
    })

    if (response.ok) {
      router.refresh()
    } else {
      const data = await response.json()
      setError(data.error)
    }

    setLoading(false)
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Image
            src={user.profileImage || "/placeholder.svg"}
            alt="Profile"
            width={100}
            height={100}
            className="rounded-full"
          />
          <CardTitle>Edit Profile</CardTitle>
        </div>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Input name="name" placeholder="Full Name" defaultValue={user.name || ""} />
          </div>
          <div className="space-y-2">
            <Input name="email" type="email" placeholder="Email" defaultValue={user.email} />
          </div>
          <div className="space-y-2">
            <Input name="password" type="password" placeholder="New Password (leave blank to keep current)" />
          </div>
          <div className="space-y-2">
            <Input
              name="dateOfBirth"
              type="date"
              defaultValue={user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : ""}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={handleLogout}>
            Logout
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

