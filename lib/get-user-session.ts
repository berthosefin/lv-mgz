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
  const accessToken = cookies().get("access_token")?.value;

  if (accessToken) {
    try {
      const decodedToken = jose.decodeJwt(accessToken);
      if (
        typeof decodedToken.sub === "string" &&
        typeof decodedToken.username === "string" &&
        typeof decodedToken.storeId === "string" &&
        typeof decodedToken.cashDeskId === "string"
      ) {
        return {
          userId: decodedToken.sub,
          username: decodedToken.username,
          storeId: decodedToken.storeId,
          cashDeskId: decodedToken.cashDeskId,
        };
      }
    } catch (error) {}
  }

  redirect("/login");
}
