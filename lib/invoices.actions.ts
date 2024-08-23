"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL;

type NewInvoiceDataType = {
  orderId: string;
  clientId: string;
};

type UpdateInvoiceDataType = {
  status: string;
};

export const createInvoice = async (sellArticleData: NewInvoiceDataType) => {
  const access_token = cookies().get("access_token");

  const res = await fetch(`${API_URL}/invoices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
    body: JSON.stringify(sellArticleData),
  });

  if (!res.ok) throw new Error("failed to create order");

  revalidatePath("/invoices");
  return res.json();
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
