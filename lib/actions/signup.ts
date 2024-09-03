"use server";

import z from "zod";
import { createServerAction } from "zsa";
import { API_URL } from "../constants";

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
