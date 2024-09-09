"use server";

import { z } from "zod";
import { createServerAction } from "zsa";
import { fetchWithAuth } from "../api-utils";

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
    return fetchWithAuth(`/invoices/${input.id}`, {
      method: "PATCH",
      body: input.updateInvoiceData,
    });
  });
