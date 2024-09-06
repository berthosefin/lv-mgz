"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { createServerAction } from "zsa";
import { API_URL } from "../constants";

export const replenishArticleAction = createServerAction()
  .input(
    z.object({
      id: z.string(),
      replenishArticleData: z.object({
        replenishQuantity: z.number(),
      }),
    })
  )
  .handler(async ({ input }) => {
    try {
      const accessToken = cookies().get("access_token")?.value;
      const res = await fetch(`${API_URL}/articles/${input.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(input.replenishArticleData),
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
