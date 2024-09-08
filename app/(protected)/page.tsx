import { ArticleCountCard } from "@/components/ArticleCountCard";
import { ArticleLowStockCard } from "@/components/ArticleLowStockCard";
import { CurrentMonthPurchaseCard } from "@/components/CurrentMonthPurchaseCard";
import { CurrentMonthRevenueCard } from "@/components/CurrentMonthRevenueCard";
import { CurrentMonthSaleCard } from "@/components/CurrentMonthSaleCard";
import { SaleChart } from "@/components/SaleChart";
import { TransactionCard } from "@/components/TransactionCard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getHeaders } from "@/lib/actions/headers";
import { API_URL } from "@/lib/constants";
import { getUserData } from "@/lib/get-user-data";
import { Metadata } from "next";
import { Suspense } from "react";

const getTransactionsMonthlySummary = async (storeId: string) => {
  const res = await fetch(
    `${API_URL}/transactions/monthly-summary?storeId=${storeId}&year=${new Date().getFullYear()}`,
    {
      headers: getHeaders(),
      cache: "no-store",
    }
  );

  return await res.json();
};

export const metadata: Metadata = {
  title: `Accueil`,
};

export default async function HomePage() {
  const userData = await getUserData();
  const transactionsMonthlySummary: TransactionsMonthlySummary[] =
    await getTransactionsMonthlySummary(userData.store.id);

  return (
    <main className="flex flex-1 flex-col gap-4 md:gap-8 md:p-4">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
          <CurrentMonthRevenueCard
            transactionsMonthlySummary={transactionsMonthlySummary}
          />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
          <CurrentMonthSaleCard
            transactionsMonthlySummary={transactionsMonthlySummary}
          />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
          <CurrentMonthPurchaseCard
            transactionsMonthlySummary={transactionsMonthlySummary}
          />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
          <ArticleCountCard storeId={userData.store.id} />
        </Suspense>
      </div>

      <div className="grid gap-4 md:gap-8 xl:grid-cols-4">
        <Suspense
          fallback={
            <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
              <Skeleton className="h-full w-full rounded-lg" />
            </Card>
          }
        >
          <TransactionCard cashDeskId={userData.store.cashDesk.id} />
        </Suspense>

        <Suspense
          fallback={
            <Card x-chunk="dashboard-01-chunk-5">
              <Skeleton className="h-full w-full rounded-lg" />
            </Card>
          }
        >
          <SaleChart transactionsMonthlySummary={transactionsMonthlySummary} />
        </Suspense>

        <Suspense
          fallback={
            <Card x-chunk="dashboard-01-chunk-4">
              <Skeleton className="h-full w-full rounded-lg" />
            </Card>
          }
        >
          <ArticleLowStockCard storeId={userData.store.id} />
        </Suspense>
      </div>
    </main>
  );
}
