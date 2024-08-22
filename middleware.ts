import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL;

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
      throw new Error("Failed to refresh access token");
    }

    const { access_token } = await response.json();
    return { accessToken: access_token };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isProtectedRoute = !isAuthPage;

  if (!accessToken) {
    // Si l'utilisateur n'est pas connecté
    if (isProtectedRoute) {
      // Rediriger vers /login si l'utilisateur essaie d'accéder à une page protégée
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } else {
    // Si l'utilisateur est connecté, vérifier la validité du token
    try {
      const decodedToken = jwtDecode<any>(accessToken);
      const now = Math.floor(Date.now() / 1000);

      if (decodedToken.exp < now && !isAuthPage) {
        // Token expiré, essayer de rafraîchir le token
        if (refreshToken) {
          const tokens = await refreshAccessToken(refreshToken);

          if (tokens) {
            // Mettre à jour les cookies avec les nouveaux tokens
            const response = NextResponse.next();
            response.cookies.set("access_token", tokens.accessToken, {
              path: "/",
            });
            return response;
          }
        }

        // Si le rafraîchissement du token échoue ou si aucun refresh token n'est trouvé, rediriger vers /login
        return NextResponse.redirect(new URL("/login", req.url));
      }

      // Rediriger l'utilisateur connecté loin de /login ou /signup
      if (decodedToken.exp > now && isAuthPage) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (error) {
      // Si le token est invalide (mal formé, etc.), rediriger vers /login
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Continuer vers la page demandée
  return NextResponse.next();
}

// Configurer les chemins où le middleware sera appliqué
export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"], // Appliquer le middleware à toutes les pages sauf les assets statiques
};
