"use server";

import { revalidatePath } from "next/cache";

const API_URL = process.env.API_URL;

type ArticleDataType = {
  name: String;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  unit: string;
  storeId?: string;
};

type SellArticleDataType = {
  articles: String[];
  sellQuantities: number[];
  cashDeskId: string;
};

type ReplenishArticleDataType = {
  replenishQuantity: number;
  cashDeskId?: string;
};

export const addArticle = async (articleData: ArticleDataType) => {
  const res = await fetch(`${API_URL}/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(articleData),
  });

  if (!res.ok) throw new Error("failed to add article");

  revalidatePath("/articles");
  return res.json();
};

export const sellArticle = async (sellArticleData: SellArticleDataType) => {
  const res = await fetch(`${API_URL}/articles/sell`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sellArticleData),
  });

  if (!res.ok) throw new Error("failed to sell articles");

  revalidatePath("/articles");
  return res.json();
};

export const replenishArticle = async (
  id: string,
  replenishArticleData: ReplenishArticleDataType
) => {
  const res = await fetch(`${API_URL}/articles/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(replenishArticleData),
  });

  if (!res.ok) throw new Error("failed to replenish article");

  revalidatePath("/articles");
  return res.json();
};
