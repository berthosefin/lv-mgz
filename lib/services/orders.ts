import { API_URL } from "../constants";
import { getHeaders } from "./headers";

export const getOrders = async (
  storeId: string,
  pageIndex: number,
  pageSize: number,
  searchTerm: string,
  statusFilter: string
) => {
  const res = await fetch(
    `${API_URL}/orders?storeId=${storeId}&page=${pageIndex}&pageSize=${pageSize}&clientName=${searchTerm}&status=${
      statusFilter === "all" ? "" : statusFilter
    }`,
    {
      headers: getHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error("Erreur lors de la récupération des données");
  }

  return await res.json();
};
