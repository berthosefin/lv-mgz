"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

export const removeOrder = async (id: string) => {
  const access_token = cookies().get("access_token");

  const res = await fetch(`${API_URL}/orders/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
  });

  if (!res.ok) return { success: false, message: "failed to remove order" };

  revalidatePath("/orders");
  return { success: true, data: await res.json() };
};
