"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { createServerAction } from "zsa";
import { API_URL } from "../constants";

export const addArticleAction = createServerAction()
  .input(
    z.object({
      name: z.string(),
      purchasePrice: z.number(),
      sellingPrice: z.number(),
      stock: z.number(),
      unit: z.string(),
      storeId: z.string().optional(),
    })
  )
  .handler(async ({ input }) => {
    try {
      const accessToken = cookies().get("access_token")?.value;
      const res = await fetch(`${API_URL}/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: input.name,
          purchasePrice: input.purchasePrice,
          sellingPrice: input.sellingPrice,
          stock: input.stock,
          unit: input.unit,
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
