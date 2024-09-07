"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { createServerAction } from "zsa";
import { API_URL } from "../constants";

export const updateClientAction = createServerAction()
  .input(
    z.object({
      id: z.string(),
      updateClientData: z.object({
        name: z.string(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
      }),
    })
  )
  .handler(async ({ input }) => {
    try {
      const accessToken = cookies().get("access_token")?.value;
      const res = await fetch(`${API_URL}/clients/${input.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(input.updateClientData),
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
