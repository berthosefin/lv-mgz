import { calculateMonthlyData } from "@/lib/calculate-monthly-data";
import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const CurrentMonthRevenueCard = async ({
  transactionsMonthlySummary,
  currency,
}: {
  transactionsMonthlySummary: TransactionsMonthlySummary[];
  currency: string;
}) => {
  const { currentMonthRevenue, revenueDifference } = calculateMonthlyData(
    transactionsMonthlySummary
  );

  return (
    <Card x-chunk="dashboard-01-chunk-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{`${currentMonthRevenue.toLocaleString(
          "fr-FR"
        )} ${currency}`}</div>
        <p className="text-xs text-muted-foreground">
          {`${
            revenueDifference > 0
              ? `+${revenueDifference.toLocaleString(
                  "fr-FR"
                )} ${currency} depuis le mois dernier`
              : `-${Math.abs(revenueDifference).toLocaleString(
                  "fr-FR"
                )} ${currency} depuis le mois dernier`
          }`}
        </p>
      </CardContent>
    </Card>
  );
};
