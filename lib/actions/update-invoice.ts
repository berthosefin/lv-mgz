"use server";

import { z } from "zod";
import { createServerAction } from "zsa";
import { API_URL } from "../constants";
import { getHeaders } from "./headers";

export const updateInvoiceAction = createServerAction()
  .input(
    z.object({
      id: z.string(),
      updateInvoiceData: z.object({
        isPaid: z.boolean(),
      }),
    })
  )
  .handler(async ({ input }) => {
    try {
      const res = await fetch(`${API_URL}/invoices/${input.id}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(input.updateInvoiceData),
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
