"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ArticleDataType = {
  name: String;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  unit: string;
  storeId?: string;
};

type ReplenishArticleDataType = {
  replenishQuantity: number;
};

export const addArticle = async (articleData: ArticleDataType) => {
  const access_token = cookies().get("access_token");

  const res = await fetch(`${API_URL}/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
    body: JSON.stringify(articleData),
  });

  if (!res.ok) throw new Error("failed to add article");

  revalidatePath("/articles");
  return res.json();
};

export const replenishArticle = async (
  id: string,
  replenishArticleData: ReplenishArticleDataType
) => {
  const access_token = cookies().get("access_token");

  const res = await fetch(`${API_URL}/articles/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
    body: JSON.stringify(replenishArticleData),
  });

  if (!res.ok) throw new Error("failed to replenish article");

  revalidatePath("/articles");
  return res.json();
};

export const removeArticle = async (id: string) => {
  const access_token = cookies().get("access_token");

  const res = await fetch(`${API_URL}/articles/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
  });

  if (!res.ok) return { success: false, message: "failed to remove article" };

  revalidatePath("/articles");
  return { success: true, data: await res.json() };
};
