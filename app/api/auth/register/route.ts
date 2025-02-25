import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { hash } from "bcrypt"

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const existingUser = await prisma.user.findUnique({
      where: { email: json.email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    const hashedPassword = await hash(json.password, 10)
    const user = await prisma.user.create({
      data: {
        email: json.email,
        password: hashedPassword,
        name: json.name,
        dateOfBirth: json.dateOfBirth ? new Date(json.dateOfBirth) : null,
      },
    })

    return NextResponse.json({ id: user.id })
  } catch (error) {
    return NextResponse.json({ error: "Error creating user" }, { status: 500 })
  }
}

