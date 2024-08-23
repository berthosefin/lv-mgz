"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL;

type NewOrderDataType = {
  storeId: string;
  clientName: string;
  isPaid: boolean;
  isDelivered: boolean;
  orderItems: {
    articleId: string;
    quantity: number;
  }[];
};

type UpdateOrderDataType = {
  isPaid: boolean;
  isDelivered: boolean;
};

export const createOrder = async (newOrderData: NewOrderDataType) => {
  const access_token = cookies().get("access_token");

  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
    body: JSON.stringify(newOrderData),
  });

  if (!res.ok) throw new Error("failed to create order");

  revalidatePath("/orders");
  return res.json();
};

export const updateOrder = async (
  id: string,
  UpdateOrderData: UpdateOrderDataType
) => {
  const access_token = cookies().get("access_token");

  const res = await fetch(`${API_URL}/orders/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
    body: JSON.stringify(UpdateOrderData),
  });

  if (!res.ok) throw new Error("failed to update orders");

  revalidatePath("/orders");
  return res.json();
};
