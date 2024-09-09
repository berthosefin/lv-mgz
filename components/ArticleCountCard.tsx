import { fetchWithAuth } from "@/lib/api-utils";
import { getSession } from "@/lib/get-session";
import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const ArticleCountCard = async () => {
  const { storeId } = await getSession();
  const articlesCount = await fetchWithAuth(
    `/articles/count?storeId=${storeId}`
  );

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
