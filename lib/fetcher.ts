import Cookies from "js-cookie";

export const fetcher = async (url: string) => {
  const accessToken = Cookies.get("access_token");

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Erreur lors de la récupération des données");
  }

  return await res.json();
};
