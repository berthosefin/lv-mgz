import { calculateMonthlyData } from "@/lib/calculate-monthly-data";
import { getTransactionsMonthlySummary } from "@/lib/get-transactions-monthly-summary";
import { Plus } from "lucide-react";
import MyCard from "./MyCard";

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
    <MyCard
      title={`Résumé des Approvisionnements`}
      value={`${currentMonthPurchases.toLocaleString("fr-FR")} MGA`}
      description={`${
        purchasesDifference > 0
          ? `+${purchasesDifference.toLocaleString(
              "fr-FR"
            )} MGA depuis le mois dernier`
          : `-${Math.abs(purchasesDifference).toLocaleString(
              "fr-FR"
            )} MGA depuis le mois dernier`
      }`}
      icon={<Plus />}
    />
  );
};
