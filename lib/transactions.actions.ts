"use server";

import { revalidatePath } from "next/cache";

const API_URL = process.env.API_URL;

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
  const res = await fetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transactionData),
  });

  if (!res.ok) throw new Error("failed to create transaction");

  revalidatePath("/cashdesks");
  return res.json();
};
