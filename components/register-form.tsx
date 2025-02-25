"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
        name: formData.get("name"),
        dateOfBirth: formData.get("dateOfBirth"),
      }),
    })

    if (response.ok) {
      router.push("/login")
    } else {
      const data = await response.json()
      setError(data.error)
    }

    setLoading(false)
  }

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Input name="name" placeholder="Full Name" required />
          </div>
          <div className="space-y-2">
            <Input name="email" type="email" placeholder="Email" required />
          </div>
          <div className="space-y-2">
            <Input name="password" type="password" placeholder="Password" required />
          </div>
          <div className="space-y-2">
            <Input name="dateOfBirth" type="date" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}

