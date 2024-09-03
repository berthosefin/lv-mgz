import { calculateMonthlyData } from "@/lib/calculate-monthly-data";
import { getTransactionsMonthlySummary } from "@/lib/get-transactions-monthly-summary";
import { CreditCard } from "lucide-react";
import MyCard from "./MyCard";

export const CurrentMonthSaleCard = async ({
  storeId,
}: {
  storeId: string;
}) => {
  const transactionsMonthlySummary = await getTransactionsMonthlySummary(
    storeId
  );
  const { currentMonthSales, salesDifference } = calculateMonthlyData(
    transactionsMonthlySummary
  );

  return (
    <MyCard
      title={`Résumé des Ventes`}
      value={`${currentMonthSales.toLocaleString("fr-FR")} MGA`}
      description={`${
        salesDifference > 0
          ? `+${salesDifference.toLocaleString(
              "fr-FR"
            )} MGA depuis le mois dernier`
          : `-${Math.abs(salesDifference).toLocaleString(
              "fr-FR"
            )} MGA depuis le mois dernier`
      }`}
      icon={<CreditCard />}
    />
  );
};
