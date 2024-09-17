import * as jose from "jose";
import { cookies } from "next/headers";

export const getSession = async (): Promise<{
  id: string;
  username: string;
  storeId: string;
  cashDeskId: string;
  currency: string;
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
        currency: session.currency as string,
      };
    } catch (error) {}
  }

  return {
    id: "",
    username: "",
    storeId: "",
    cashDeskId: "",
    currency: "",
  };
};
