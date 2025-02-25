import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from "jsonwebtoken"
import { getCsrfToken, validateToken } from "@/lib/csrf"
import type { JWTPayload } from "@/lib/types"

export function middleware(request: NextRequest) {
  // CSRF protection for mutation requests
  if (request.method !== "GET" && request.method !== "HEAD") {
    const csrfToken = getCsrfToken(request)
    if (!csrfToken || !validateToken(csrfToken)) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 })
    }
  }

  const token = request.cookies.get("token")?.value

  if (!token || !process.env.JWT_SECRET) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET) as JWTPayload
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", decoded.userId)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: ["/profile/:path*", "/api/profile/:path*", "/workouts/:path*", "/api/workouts/:path*"],
}

