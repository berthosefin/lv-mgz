import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getArticlesCount = async (storeId: string, search?: string) => {
  const access_token = cookies().get("access_token");

  let apiUrl = `${API_URL}/articles/count?storeId=${storeId}`;

  if (search) {
    apiUrl += `&search=${search}`; // Ajoutez le paramètre de recherche à l'URL
  }

  try {
    const res = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${access_token?.value}`,
      },
    });

    if (!res.ok) {
      const errorDetail = await res.text();
      throw new Error(`Failed to fetch the count of articles: ${errorDetail}`);
    }

    return res.json();
  } catch (error: any) {
    throw new Error("Failed to fetch the count of articles");
  }
};

export async function getLowStockArticles(storeId: string) {
  const access_token = cookies().get("access_token");
  let apiUrl = `${API_URL}/articles/low?storeId=${storeId}`;

  const res = await fetch(apiUrl, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${access_token?.value}`,
    },
  });

  if (!res.ok) throw new Error("failed to LowStockArticles");

  return res.json();
}
