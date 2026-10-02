export { auth as proxy } from "@/auth"

export const config = {
  // Matches all routes except static files, api, and next internal
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
