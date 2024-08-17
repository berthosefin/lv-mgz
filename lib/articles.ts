const API_URL = process.env.API_URL;

export const getAllArticles = async (
  storeId: string,
  page?: number,
  pageSize?: number
) => {
  let apiUrl = `${API_URL}/articles?storeId=${storeId}`;

  if (page && pageSize) {
    apiUrl = `${API_URL}/articles?storeId=${storeId}&page=${page}&pageSize=${pageSize}`;
  }

  const res = await fetch(apiUrl, { cache: "no-store" });

  if (!res.ok) throw new Error("failed to fetch all articles");

  return res.json();
};

export const getArticlesCount = async (storeId: string) => {
  const res = await fetch(`${API_URL}/articles/count?storeId=${storeId}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("failed to fetch the count of articles");

  return res.json();
};

export async function getLowStockArticles(storeId: string) {
  let apiUrl = `${API_URL}/articles/low?storeId=${storeId}`;

  const res = await fetch(apiUrl, { cache: "no-store" });

  if (!res.ok) throw new Error("failed to LowStockArticles");

  return res.json();
}

export const getArticle = async (id: string) => {
  const res = await fetch(`${API_URL}/articles/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("failed to fetch article");

  return res.json();
};
