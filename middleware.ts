import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("access_token");

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isProtectedRoute = !isAuthPage;

  if (!token) {
    // Si l'utilisateur n'est pas connecté
    if (isProtectedRoute) {
      // Rediriger vers /login si l'utilisateur essaie d'accéder à une page protégée
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } else {
    // Si l'utilisateur est connecté
    if (isAuthPage) {
      // Rediriger vers / s'il essaie d'accéder à /login ou /signup
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Continuer vers la page demandée
  return NextResponse.next();
}

// Configurer les chemins où le middleware sera appliqué
export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"], // Appliquer le middleware à toutes les pages sauf les assets statiques
};
