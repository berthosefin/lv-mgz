import * as jose from "jose";
import { NextRequest, NextResponse } from "next/server";
import { refreshAccessToken } from "./lib/actions/auth";

const PUBLIC_ROUTES = ["/login", "/signup"];
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME
  ? Number(process.env.JWT_EXPIRATION_TIME)
  : 3600;

function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.includes(path);
}

function isTokenExpired(token: string): boolean {
  const decoded = jose.decodeJwt(token);
  return (decoded.exp ?? 0) < Math.floor(Date.now() / 1000);
}

function createRedirectResponse(req: NextRequest, path: string): NextResponse {
  const url = new URL(path, req.url);
  url.searchParams.set("redirected", "true");
  return NextResponse.redirect(url);
}

function setAccessTokenCookie(response: NextResponse, token: string): void {
  response.cookies.set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: JWT_EXPIRATION_TIME,
  });
}

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname, searchParams } = req.nextUrl;
  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return accessToken && !isTokenExpired(accessToken)
      ? createRedirectResponse(req, "/")
      : NextResponse.next();
  }

  // Handle protected routes
  if (!accessToken || isTokenExpired(accessToken)) {
    if (refreshToken && !searchParams.get("redirected")) {
      try {
        const tokens = await refreshAccessToken(refreshToken);
        if (tokens?.access_token) {
          const response = NextResponse.redirect(req.url);
          setAccessTokenCookie(response, tokens.access_token);
          response.headers.set("x-middleware-rewrite", req.url);
          return response;
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
      }
    }
    return createRedirectResponse(req, "/login");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
