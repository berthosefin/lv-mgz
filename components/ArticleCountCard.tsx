import { getHeaders } from "@/lib/actions/headers";
import { API_URL } from "@/lib/constants";
import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const getArtcilesCount = async (storeId: string) => {
  const res = await fetch(`${API_URL}/articles/count?storeId=${storeId}`, {
    headers: getHeaders(),
    cache: "no-store",
  });

  return await res.json();
};

export const ArticleCountCard = async ({ storeId }: { storeId: string }) => {
  const articlesCount = await getArtcilesCount(storeId);

  return (
    <Card x-chunk="dashboard-01-chunk-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Résumé des Stocks</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{`${articlesCount}`}</div>
        <p className="text-xs text-muted-foreground">Produits en Stock</p>
      </CardContent>
    </Card>
  );
};
