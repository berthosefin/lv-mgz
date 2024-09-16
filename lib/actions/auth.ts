"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerAction } from "zsa";
import { fetchWithAuth, fetchWithoutAuth } from "../api-utils";

export const signupAction = createServerAction()
  .input(
    z.object({
      username: z.string(),
      email: z.string().email(),
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
      email: z.string().email(),
      password: z.string(),
    })
  )
  .handler(async ({ input }) => {
    const response = await fetchWithoutAuth("/auth/login", {
      method: "POST",
      body: input,
    });

    const { access_token, refresh_token, user } = response;

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
    };

    if (access_token) {
      cookies().set("access_token", access_token, {
        ...cookieOptions,
        maxAge: parseExpirationTime(process.env.JWT_EXPIRATION_TIME),
      });
    }
    if (refresh_token) {
      cookies().set("refresh_token", refresh_token, {
        ...cookieOptions,
        maxAge: parseExpirationTime(process.env.JWT_REFRESH_EXPIRATION_TIME),
      });
    }

    return user;
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

const parseExpirationTime = (expirationTime: string | undefined): number => {
  if (!expirationTime) throw new Error("expirationTime is undefined");

  const unit = expirationTime.slice(-1); // 'm', 'h', 'd', etc.
  const amount = parseInt(expirationTime.slice(0, -1), 10); // La partie numérique

  switch (unit) {
    case "m": // minutes
      return amount * 60;
    case "h": // hours
      return amount * 60 * 60;
    case "d": // days
      return amount * 24 * 60 * 60;
    default:
      throw new Error("Unsupported expiration time format");
  }
};
