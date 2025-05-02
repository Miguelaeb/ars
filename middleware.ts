import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has("auth")
  const isLoginPage = request.nextUrl.pathname === "/login"
  const isAccessDeniedPage = request.nextUrl.pathname === "/acceso-denegado"

  // Si el usuario no está autenticado y está intentando acceder a una ruta protegida
  if (!isAuthenticated && !isLoginPage && !isAccessDeniedPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Si el usuario está autenticado y está intentando acceder a la página de login
  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
