import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from "jsonwebtoken"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!)
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", decoded.userId)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch {
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: ["/profile/:path*", "/api/profile/:path*"],
}

