"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { createServerAction } from "zsa";
import { API_URL } from "../constants";

export const addClientAction = createServerAction()
  .input(
    z.object({
      name: z.string(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
      storeId: z.string().optional(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const accessToken = cookies().get("access_token")?.value;
      const res = await fetch(`${API_URL}/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: input.name,
          email: input.email,
          phone: input.phone,
          address: input.address,
          city: input.city,
          storeId: input.storeId,
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
