import { cookies } from "next/headers";

const API_URL = process.env.API_URL;

export const getAllArticles = async (
  storeId: string,
  page?: number,
  pageSize?: number,
  search?: string
) => {
  const access_token = cookies().get("access_token");

  let apiUrl = `${API_URL}/articles?storeId=${storeId}`;

  if (page && pageSize) {
    apiUrl += `&page=${page}&pageSize=${pageSize}`;
  }

  if (search) {
    apiUrl += `&search=${search}`; // Ajoutez le paramètre de recherche à l'URL
  }

  const res = await fetch(apiUrl, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${access_token?.value}`,
    },
  });

  if (!res.ok) throw new Error("failed to fetch all articles");

  return res.json();
};

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

export const getArticle = async (id: string) => {
  const access_token = cookies().get("access_token");

  const res = await fetch(`${API_URL}/articles/${id}`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${access_token?.value}`,
    },
  });

  if (!res.ok) throw new Error("failed to fetch article");

  return res.json();
};
