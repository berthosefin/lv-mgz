"use server";

import * as jose from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerAction } from "zsa";
import { fetchWithAuth, fetchWithoutAuth } from "../api-utils";

export const signupAction = createServerAction()
  .input(
    z.object({
      username: z.string(),
      password: z.string(),
      storeName: z.string(),
    })
  )
  .handler(async ({ input }) => {
    return fetchWithoutAuth("/users", {
      method: "POST",
      body: input,
    });
  });

export const loginAction = createServerAction()
  .input(
    z.object({
      username: z.string(),
      password: z.string(),
    })
  )
  .handler(async ({ input }) => {
    const { access_token, refresh_token } = await fetchWithoutAuth(
      "/auth/login",
      {
        method: "POST",
        body: input,
      }
    );

    const cookieOptionsAccessToken = {
      path: "/",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
    };

    const cookieOptionsRefreshToken = {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
    };

    cookies().set("access_token", access_token, cookieOptionsAccessToken);
    cookies().set("refresh_token", refresh_token, cookieOptionsRefreshToken);

    const decodedToken: jose.JWTPayload = jose.decodeJwt(access_token);
    return decodedToken;
  });

export async function refreshAccessToken(refreshToken: string) {
  return await fetchWithoutAuth(`/auth/refresh`, {
    method: "POST",
    body: { refresh_token: refreshToken },
  });
}

export const logoutAction = createServerAction().handler(async () => {
  const accessToken = cookies().get("access_token")?.value;
  const refreshToken = cookies().get("refresh_token")?.value;

  await fetchWithAuth("/auth/logout", {
    method: "POST",
    body: { access_token: accessToken, refresh_token: refreshToken },
  });

  const cookieOptions = {
    path: "/",
    expires: new Date(0),
  };
  cookies().set("access_token", "", cookieOptions);
  cookies().set("refresh_token", "", cookieOptions);

  redirect("/login");
});
