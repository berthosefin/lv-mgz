import { calculateMonthlyData } from "@/lib/calculate-monthly-data";
import { CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const CurrentMonthSaleCard = async ({
  transactionsMonthlySummary,
}: {
  transactionsMonthlySummary: TransactionsMonthlySummary[];
}) => {
  const { currentMonthSales, salesDifference } = calculateMonthlyData(
    transactionsMonthlySummary
  );

  return (
    <Card x-chunk="dashboard-01-chunk-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Résumé des Ventes</CardTitle>
        <CreditCard className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{`${currentMonthSales.toLocaleString(
          "fr-FR"
        )} MGA`}</div>
        <p className="text-xs text-muted-foreground">
          {`${
            salesDifference > 0
              ? `+${salesDifference.toLocaleString(
                  "fr-FR"
                )} MGA depuis le mois dernier`
              : `-${Math.abs(salesDifference).toLocaleString(
                  "fr-FR"
                )} MGA depuis le mois dernier`
          }`}
        </p>
      </CardContent>
    </Card>
  );
};
