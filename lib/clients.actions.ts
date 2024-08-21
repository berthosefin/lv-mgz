"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL;

type ClientDataType = {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  storeId?: string;
};

type EditClientDataType = Partial<ClientDataType>;

export const addClient = async (clientData: ClientDataType) => {
  const access_token = cookies().get("access_token");

  const res = await fetch(`${API_URL}/clients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
    body: JSON.stringify(clientData),
  });

  if (!res.ok) throw new Error("failed to add article");

  revalidatePath("/clients");
  return res.json();
};

export const editClient = async (
  id: string,
  editClientDataType: EditClientDataType
) => {
  const access_token = cookies().get("access_token");

  const res = await fetch(`${API_URL}/clients/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
    body: JSON.stringify(editClientDataType),
  });

  if (!res.ok) throw new Error("failed to edit client");

  revalidatePath("/clients");
  return res.json();
};
