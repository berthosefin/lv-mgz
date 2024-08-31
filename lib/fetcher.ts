import Cookies from "js-cookie";

export const fetcher = (url: string) => {
  const accessToken = Cookies.get("access_token");

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Erreur lors de la récupération des données");
    }
    return res.json();
  });
};
