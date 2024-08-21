import { cookies } from "next/headers";

const API_URL = process.env.API_URL;

export const getAllClients = async (
  storeId: string,
  page?: number,
  pageSize?: number
) => {
  const access_token = cookies().get("access_token");

  let apiUrl = `${API_URL}/clients?storeId=${storeId}`;

  if (page && pageSize) {
    apiUrl = `${API_URL}/clients?storeId=${storeId}&page=${page}&pageSize=${pageSize}`;
  }

  const res = await fetch(apiUrl, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${access_token?.value}`,
    },
  });

  if (!res.ok) throw new Error("failed to fetch all clients");

  return res.json();
};

export const getClientCount = async (storeId: string) => {
  const access_token = cookies().get("access_token");

  try {
    const res = await fetch(`${API_URL}/clients/count?storeId=${storeId}`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${access_token?.value}`,
      },
    });

    if (!res.ok) {
      const errorDetail = await res.text(); // Capturez plus de détails
      throw new Error(`Failed to fetch the count of client: ${errorDetail}`);
    }

    return res.json();
  } catch (error: any) {
    throw new Error("Failed to fetch the count of clients");
  }
};

export const getClient = async (id: string) => {
  const access_token = cookies().get("access_token");

  const res = await fetch(`${API_URL}/clients/${id}`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${access_token?.value}`,
    },
  });

  if (!res.ok) throw new Error("failed to fetch client");

  return res.json();
};
