import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { hash } from "bcrypt"
import { headers } from "next/headers"

export async function PUT(req: Request) {
  try {
    const headersList = headers()
    const userId = headersList.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const json = await req.json()
    const updateData: any = {
      name: json.name,
      email: json.email,
      dateOfBirth: json.dateOfBirth ? new Date(json.dateOfBirth) : null,
    }

    if (json.password) {
      updateData.password = await hash(json.password, 10)
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Error updating profile" }, { status: 500 })
  }
}

