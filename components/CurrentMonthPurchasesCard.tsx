import { calculateMonthlyData } from "@/lib/calculate";
import { Plus } from "lucide-react";
import MyCard from "./MyCard";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getTransactionsMonthlySummary = async (storeId: string) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const url = `${API_URL}/transactions/monthly-summary?storeId=${storeId}&year=${new Date().getFullYear()}`;
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

export const CurrentMonthPurchasesCard = async ({
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
