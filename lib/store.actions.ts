"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL;

type EditStoreDataType = {
  name: string;
  description?: string;
  status?: string;
  nif?: string;
  stat?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
};

export const editStore = async (
  storeId: string,
  editStoreDataType: EditStoreDataType
) => {
  const access_token = cookies().get("access_token");

  const res = await fetch(`${API_URL}/store/${storeId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
    body: JSON.stringify(editStoreDataType),
  });

  if (!res.ok) throw new Error("failed to edit store");

  revalidatePath("/");
  return res.json();
};
