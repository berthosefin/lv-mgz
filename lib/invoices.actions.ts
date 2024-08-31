"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type UpdateInvoiceDataType = {
  isPaid: boolean;
};

export const updateInvoice = async (
  id: string,
  UpdateInvoiceData: UpdateInvoiceDataType
) => {
  const access_token = cookies().get("access_token");

  const res = await fetch(`${API_URL}/invoices/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
    body: JSON.stringify(UpdateInvoiceData),
  });

  if (!res.ok) throw new Error("failed to update invoices");

  revalidatePath("/invoices");
  return res.json();
};
