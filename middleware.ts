import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      // console.warn("Failed to refresh access token");
      return null;
    }

    const { access_token } = await response.json();
    return { accessToken: access_token };
  } catch (error: any) {
    throw new Error(error);
  }
}

async function validateAccessToken(accessToken: string) {
  try {
    const response = await fetch(`${API_URL}/auth/validate`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      // console.warn("Invalid access token");
      return false;
    }

    const { valid } = await response.json();
    return valid;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isProtectedRoute = !isAuthPage;

  if (!accessToken) {
    if (isProtectedRoute && !searchParams.get("redirected")) {
      const url = new URL("/login", req.url);
      url.searchParams.set("redirected", "true");
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Vérifier la validité du token
  const isTokenValid = await validateAccessToken(accessToken);

  if (!isTokenValid) {
    if (refreshToken) {
      const tokens = await refreshAccessToken(refreshToken);

      if (tokens) {
        const response = NextResponse.next();
        response.cookies.set("access_token", tokens.accessToken, {
          path: "/",
        });
        return response;
      }
    }

    // Eviter la redirection infinie
    if (!isAuthPage && !searchParams.get("redirected")) {
      const url = new URL("/login", req.url);
      url.searchParams.set("redirected", "true");
      return NextResponse.redirect(url);
    }
  }

  if (isTokenValid && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Configurer les chemins où le middleware sera appliqué
export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"], // Appliquer le middleware à toutes les pages sauf les assets statiques
};
