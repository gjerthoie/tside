import type { NextRequest } from "next/server"
import crypto from "crypto"

export function generateToken() {
  return crypto.randomBytes(32).toString("hex")
}

export function validateToken(token: string) {
  if (!process.env.CSRF_SECRET) {
    throw new Error("CSRF_SECRET is not set")
  }

  const expectedToken = crypto.createHmac("sha256", process.env.CSRF_SECRET).update(token).digest("hex")

  return expectedToken === token
}

export function getCsrfToken(req: NextRequest) {
  return req.cookies.get("csrf_token")?.value
}

