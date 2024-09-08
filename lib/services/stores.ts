import { API_URL } from "../constants";
import { getHeaders } from "./headers";

export const getStore = async (id: string) => {
  const res = await fetch(`${API_URL}/store/${id}`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    throw new Error("Erreur lors de la récupération des données");
  }

  return await res.json();
};
