import * as jose from "jose";
import { NextRequest, NextResponse } from "next/server";
import { refreshAccessToken } from "./lib/actions/auth";

const publicRoutes = ["/login", "/signup"];
const isPublicRoute = (path: string) => publicRoutes.includes(path);
const isProtectedRoute = (path: string) => !isPublicRoute(path);

function isTokenExpired(token: string): boolean {
  const decoded = jose.decodeJwt(token);
  const expirationTime = decoded.exp;
  const currentTime = Math.floor(Date.now() / 1000);
  return expirationTime ? expirationTime < currentTime : true;
}

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  const publicPage = isPublicRoute(pathname);
  const protectedPage = isProtectedRoute(pathname);

  // Si aucun access token n'est présent et c'est une page protégée, rediriger
  if (!accessToken) {
    if (protectedPage && !searchParams.get("redirected")) {
      const url = new URL("/login", req.url);
      url.searchParams.set("redirected", "true");
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Vérifier si le token est expiré localement
  if (isTokenExpired(accessToken)) {
    if (refreshToken) {
      const tokens = await refreshAccessToken(refreshToken);
      if (tokens) {
        const response = NextResponse.next();
        response.cookies.set("access_token", tokens.accessToken, { path: "/" });
        return response;
      }
    }

    // Si le refresh token est également expiré, rediriger vers login
    if (protectedPage && !searchParams.get("redirected")) {
      const url = new URL("/login", req.url);
      url.searchParams.set("redirected", "true");
      return NextResponse.redirect(url);
    }
  }

  // Si l'utilisateur est déjà authentifié, rediriger depuis une page publique
  if (accessToken && !isTokenExpired(accessToken) && publicPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
