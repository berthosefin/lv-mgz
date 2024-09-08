"use server";

import { z } from "zod";
import { createServerAction } from "zsa";
import { API_URL } from "../constants";
import { getHeaders } from "./headers";

export const updateOrderAction = createServerAction()
  .input(
    z.object({
      id: z.string(),
      updateOrderData: z.object({
        isPaid: z.boolean(),
        isDelivered: z.boolean(),
      }),
    })
  )
  .handler(async ({ input }) => {
    try {
      const res = await fetch(`${API_URL}/orders/${input.id}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(input.updateOrderData),
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
