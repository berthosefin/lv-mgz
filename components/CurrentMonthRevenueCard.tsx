import { calculateMonthlyData } from "@/lib/calculate";
import { getTransactionsMonthlySummary } from "@/lib/get-transactions-monthly-summary";
import { DollarSign } from "lucide-react";
import MyCard from "./MyCard";

export const CurrentMonthRevenueCard = async ({
  storeId,
}: {
  storeId: string;
}) => {
  const transactionsMonthlySummary = await getTransactionsMonthlySummary(
    storeId
  );
  const { currentMonthRevenue, revenueDifference } = calculateMonthlyData(
    transactionsMonthlySummary
  );

  return (
    <MyCard
      title={`Total Revenue`}
      value={`${currentMonthRevenue.toLocaleString("fr-FR")} MGA`}
      description={`${
        revenueDifference > 0
          ? `+${revenueDifference.toLocaleString(
              "fr-FR"
            )} MGA depuis le mois dernier`
          : `-${Math.abs(revenueDifference).toLocaleString(
              "fr-FR"
            )} MGA depuis le mois dernier`
      }`}
      icon={<DollarSign />}
    />
  );
};
