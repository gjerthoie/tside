import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { compare } from "bcrypt"
import { sign } from "jsonwebtoken"

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const user = await prisma.user.findUnique({
      where: { email: json.email },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const passwordMatch = await compare(json.password, user.password)
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = sign({ userId: user.id }, process.env.JWT_SECRET!)
    const response = NextResponse.json({ success: true })
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: "Error logging in" }, { status: 500 })
  }
}

