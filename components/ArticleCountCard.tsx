import { getArtcilesCount } from "@/lib/get-articles-count";
import { Activity } from "lucide-react";
import MyCard from "./MyCard";

export const ArticleCountCard = async ({ storeId }: { storeId: string }) => {
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
