"use server";

import * as jose from "jose";
import { cookies } from "next/headers";
import { z } from "zod";
import { createServerAction } from "zsa";
import { API_URL } from "../constants";
import { getHeaders } from "./headers";

export const signupAction = createServerAction()
  .input(
    z.object({
      username: z.string(),
      password: z.string(),
      storeName: z.string(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: input.username,
          password: input.password,
          storeName: input.storeName,
        }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw message;
      }

      return await res.json();
    } catch (error: any) {
      throw new Error(error);
    }
  });

export const loginAction = createServerAction()
  .input(
    z.object({
      username: z.string(),
      password: z.string(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: input.username,
          password: input.password,
        }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw message;
      }

      const { access_token, refresh_token } = await res.json();
      cookies().set("access_token", access_token, { path: "/" });
      cookies().set("refresh_token", refresh_token, { path: "/" });
      const decodedToken: jose.JWTPayload = jose.decodeJwt(access_token);

      return decodedToken;
    } catch (error: any) {
      throw new Error(error);
    }
  });

export const logoutAction = createServerAction().handler(async () => {
  try {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: getHeaders(),
    });

    if (!res.ok) {
      const { message } = await res.json();
      throw message;
    }

    const cookieOptions = {
      path: "/",
      expires: new Date(0),
    };
    cookies().set("access_token", "", cookieOptions);
    cookies().set("refresh_token", "", cookieOptions);

    return await res.json();
  } catch (error: any) {
    throw new Error(error);
  }
});
