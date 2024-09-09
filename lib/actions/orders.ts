"use server";

import { z } from "zod";
import { createServerAction } from "zsa";
import { fetchWithAuth } from "../api-utils";

export const addOrderAction = createServerAction()
  .input(
    z.object({
      storeId: z.string(),
      clientName: z.string(),
      isPaid: z.boolean(),
      isDelivered: z.boolean(),
      orderItems: z.array(
        z.object({
          articleId: z.string(),
          quantity: z.number(),
        })
      ),
    })
  )
  .handler(async ({ input }) => {
    return fetchWithAuth(`/orders`, {
      method: "POST",
      body: input,
    });
  });

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
    return fetchWithAuth(`/orders/${input.id}`, {
      method: "PATCH",
      body: input.updateOrderData,
    });
  });

export const removeOrderAction = createServerAction()
  .input(
    z.object({
      id: z.string(),
    })
  )
  .handler(async ({ input }) => {
    return fetchWithAuth(`/orders/${input.id}`, {
      method: "DELETE",
    });
  });
