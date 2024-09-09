import * as jose from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getSession = async (): Promise<{
  id: string;
  username: string;
  storeId: string;
  cashDeskId: string;
}> => {
  const accessToken = cookies().get("access_token");

  if (accessToken) {
    try {
      const session: jose.JWTPayload = jose.decodeJwt(accessToken.value);

      return {
        id: session.sub as string,
        username: session.username as string,
        storeId: session.storeId as string,
        cashDeskId: session.cashDeskId as string,
      };
    } catch (error) {}
  }

  redirect("/login");
};
