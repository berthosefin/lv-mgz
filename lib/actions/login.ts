"use server";

import * as jose from "jose";
import { cookies } from "next/headers";
import { z } from "zod";
import { createServerAction } from "zsa";
import { API_URL } from "../constants";

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
