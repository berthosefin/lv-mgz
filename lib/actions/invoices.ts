"use server";

import { z } from "zod";
import { createServerAction } from "zsa";
import { API_URL } from "../constants";
import { getHeaders } from "./headers";

export const addInvoicesHeadersAction = createServerAction()
  .input(
    z.object({
      id: z.string(),
      storeData: z.object({
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
    try {
      const res = await fetch(`${API_URL}/store/${input.id}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(input.storeData),
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
