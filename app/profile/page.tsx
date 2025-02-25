import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { ProfileForm } from "@/components/profile-form"

async function getUser() {
  const headersList = headers()
  const userId = headersList.get("x-user-id")

  if (!userId) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    redirect("/login")
  }

  return user
}

export default async function ProfilePage() {
  const user = await getUser()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Profile</h1>
      <div className="grid gap-6">
        <ProfileForm user={user} />
      </div>
    </div>
  )
}

