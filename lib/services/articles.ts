import { API_URL } from "../constants";
import { getHeaders } from "./headers";

export const getArticles = async (storeId: string) => {
  const res = await fetch(`${API_URL}/articles?storeId=${storeId}`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    throw new Error("Erreur lors de la récupération des données");
  }

  return await res.json();
};
