"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { createServerAction } from "zsa";
import { API_URL } from "../constants";

export const removeOrderAction = createServerAction()
  .input(
    z.object({
      id: z.string(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const accessToken = cookies().get("access_token")?.value;
      const res = await fetch(`${API_URL}/orders/${input.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
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
