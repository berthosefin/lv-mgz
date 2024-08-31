"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type TransactionDataType = {
  type: TransactionType;
  amount: number;
  label: string;
  articles?: string[];
  cashDeskId?: string;
};

export const createTransaction = async (
  transactionData: TransactionDataType
) => {
  const access_token = cookies().get("access_token");

  const res = await fetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
    body: JSON.stringify(transactionData),
  });

  if (!res.ok) throw new Error("failed to create transaction");

  revalidatePath("/cashdesks");
  return res.json();
};
