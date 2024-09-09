"use server";

import { z } from "zod";
import { createServerAction } from "zsa";
import { fetchWithAuth } from "../api-utils";

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
    return fetchWithAuth(`/clients`, {
      method: "POST",
      body: input,
    });
  });

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
    return fetchWithAuth(`/clients/${input.id}`, {
      method: "PATCH",
      body: input.updateClientData,
    });
  });

export const removeClientAction = createServerAction()
  .input(
    z.object({
      id: z.string(),
    })
  )
  .handler(async ({ input }) => {
    return fetchWithAuth(`/clients/${input.id}`, {
      method: "DELETE",
    });
  });
