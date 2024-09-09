"use server";

import { z } from "zod";
import { createServerAction } from "zsa";
import { fetchWithAuth } from "../api-utils";

export const updateStoreAction = createServerAction()
  .input(
    z.object({
      id: z.string(),
      updateStoreData: z.object({
        name: z.string(),
        description: z.string().optional(),
        status: z.string().optional(),
        nif: z.string().optional(),
        stat: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
      }),
    })
  )
  .handler(async ({ input }) => {
    return fetchWithAuth(`/store/${input.id}`, {
      method: "PATCH",
      body: input.updateStoreData,
    });
  });
