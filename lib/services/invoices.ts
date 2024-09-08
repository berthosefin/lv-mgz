import { API_URL } from "../constants";
import { getHeaders } from "./headers";

export const getInvoices = async (
  storeId: string,
  pageIndex: number,
  pageSize: number,
  searchTerm: string,
  isPaidFilter: string
) => {
  const res = await fetch(
    `${API_URL}/invoices?storeId=${storeId}&page=${pageIndex}&pageSize=${pageSize}&clientName=${searchTerm}&isPaid=${
      isPaidFilter === "all" ? "" : isPaidFilter
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
