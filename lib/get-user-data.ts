import * as jose from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_URL } from "./constants";

export const getUserData = async (): Promise<User> => {
  const accessToken = cookies().get("access_token");

  if (accessToken && accessToken.value.trim()) {
    try {
      const decodedToken: jose.JWTPayload = jose.decodeJwt(accessToken.value);

      const res = await fetch(`${API_URL}/users/${decodedToken.username}`, {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      });

      return await res.json();
    } catch (error) {}
  }

  redirect("/login");
};
