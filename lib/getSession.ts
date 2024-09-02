import * as jose from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface SessionType {
  userId: string;
  username: string;
  storeId: string;
  cashDeskId: string;
}

export async function getUserSession(): Promise<SessionType> {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  let payload: jose.JWTPayload | undefined = undefined;

  try {
    payload = jose.decodeJwt(accessToken);
  } catch (error) {
    redirect("/login"); // Rediriger en cas d'erreur de décodage
  }

  if (
    !payload ||
    typeof payload.sub !== "string" ||
    typeof payload.username !== "string" ||
    typeof payload.storeId !== "string" ||
    typeof payload.cashDeskId !== "string"
  ) {
    redirect("/login");
  }

  return {
    userId: payload.sub,
    username: payload.username,
    storeId: payload.storeId,
    cashDeskId: payload.cashDeskId,
  };
}
