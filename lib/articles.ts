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

export const getMinStockArticle = (articles: Article[]) => {
  const minStockArticle = articles.reduce(
    (minArticle: Article | null, currentArticle: Article) => {
      if (!minArticle) {
        return currentArticle;
      } else {
        return currentArticle.stock < minArticle.stock
          ? currentArticle
          : minArticle;
      }
    },
    null
  );

  return minStockArticle;
};

export const getMaxStockArticle = (articles: Article[]) => {
  const maxStockArticle = articles.reduce(
    (maxArticle: Article | null, currentArticle: Article) => {
      if (!maxArticle) {
        return currentArticle;
      } else {
        return currentArticle.stock > maxArticle.stock
          ? currentArticle
          : maxArticle;
      }
    },
    null
  );

  return maxStockArticle;
};

export const getArticle = async (id: string) => {
  const res = await fetch(`${API_URL}/articles/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("failed to fetch article");

  return res.json();
};
