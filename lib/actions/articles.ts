"use server";

import { z } from "zod";
import { createServerAction } from "zsa";
import { fetchWithAuth } from "../api-utils";

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
    return fetchWithAuth(`/articles`, {
      method: "POST",
      body: input,
    });
  });

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
    return fetchWithAuth(`/articles/${input.id}`, {
      method: "PATCH",
      body: input.replenishArticleData,
    });
  });

export const removeArticleAction = createServerAction()
  .input(
    z.object({
      id: z.string(),
    })
  )
  .handler(async ({ input }) => {
    return fetchWithAuth(`/articles/${input.id}`, {
      method: "DELETE",
    });
  });
