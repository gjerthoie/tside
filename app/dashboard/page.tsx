import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    console.error("Error fetching session:", error.message)
    redirect("/login")
  }

  if (!session) {
    redirect("/login")
  }

  const handleSignOut = async () => {
    "use server"
    const supabase = createServerComponentClient({ cookies })
    await supabase.auth.signOut()
    redirect("/login")
  }

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Welcome, {session.user.email}</p>
          <form action={handleSignOut}>
            <Button variant="outline">Sign Out</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

