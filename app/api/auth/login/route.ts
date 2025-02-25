import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { compare } from "bcrypt"
import { sign } from "jsonwebtoken"
import type { JWTPayload } from "@/lib/types"

export async function POST(req: Request) {
  if (!process.env.JWT_SECRET) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
  }

  try {
    const json = await req.json()

    if (!json.email || !json.password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

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

    const payload: JWTPayload = { userId: user.id }
    const token = sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" })

    const response = NextResponse.json({ success: true })
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}

