import { Activity } from "lucide-react";
import MyCard from "./MyCard";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getArtcilesCount = async (storeId: string) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const url = `${API_URL}/articles/count?storeId=${storeId}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  return res
    .json()
    .then((json) => json)
    .catch((e) => undefined);
};

export const ArticlesCountCard = async ({ storeId }: { storeId: string }) => {
  const articlesCount = await getArtcilesCount(storeId);

  return (
    <MyCard
      title={`Résumé des Stocks`}
      value={`${articlesCount}`}
      description={`Produits en Stock`}
      icon={<Activity />}
    />
  );
};
