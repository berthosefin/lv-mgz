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

    const cookieOptions = {
      path: "/",
      httpOnly: true, // Empêche l'accès au cookie via JavaScript
      secure: process.env.NODE_ENV === "production", // Utilise secure uniquement en production
      sameSite: "strict" as const, // Empêche les requêtes cross-origin avec le cookie
    };
    cookies().set("access_token", access_token, cookieOptions);
    cookies().set("refresh_token", refresh_token, cookieOptions);

    const decodedToken: jose.JWTPayload = jose.decodeJwt(access_token);
    return decodedToken;
  });

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
