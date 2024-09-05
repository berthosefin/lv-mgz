import { calculateMonthlyData } from "@/lib/calculate-monthly-data";
import { getTransactionsMonthlySummary } from "@/lib/get-transactions-monthly-summary";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const CurrentMonthPurchaseCard = async ({
  storeId,
}: {
  storeId: string;
}) => {
  const transactionsMonthlySummary = await getTransactionsMonthlySummary(
    storeId
  );
  const { currentMonthPurchases, purchasesDifference } = calculateMonthlyData(
    transactionsMonthlySummary
  );

  return (
    <Card x-chunk="dashboard-01-chunk-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Résumé des Approvisionnements
        </CardTitle>
        <Plus className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{`${currentMonthPurchases.toLocaleString(
          "fr-FR"
        )} MGA`}</div>
        <p className="text-xs text-muted-foreground">
          {`${
            purchasesDifference > 0
              ? `+${purchasesDifference.toLocaleString(
                  "fr-FR"
                )} MGA depuis le mois dernier`
              : `-${Math.abs(purchasesDifference).toLocaleString(
                  "fr-FR"
                )} MGA depuis le mois dernier`
          }`}
        </p>
      </CardContent>
    </Card>
  );
};
