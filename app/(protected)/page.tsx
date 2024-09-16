import { ArticleCountCard } from "@/components/ArticleCountCard";
import { ArticleLowStockCard } from "@/components/ArticleLowStockCard";
import { CurrentMonthPurchaseCard } from "@/components/CurrentMonthPurchaseCard";
import { CurrentMonthRevenueCard } from "@/components/CurrentMonthRevenueCard";
import { CurrentMonthSaleCard } from "@/components/CurrentMonthSaleCard";
import { SaleChart } from "@/components/SaleChart";
import { TransactionCard } from "@/components/TransactionCard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchWithAuth } from "@/lib/api-utils";
import { getSession } from "@/lib/get-session";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: `Accueil`,
};

export default async function HomePage() {
  const { storeId, currency } = await getSession();
  const params = new URLSearchParams({
    storeId: storeId || "",
    year: new Date().getFullYear().toString(),
  });
  const transactionsMonthlySummary: TransactionsMonthlySummary[] =
    await fetchWithAuth(`/transactions/monthly-summary?${params.toString()}`);

  return (
    <main className="flex flex-1 flex-col gap-4 md:gap-8 md:p-4">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
          <CurrentMonthRevenueCard
            transactionsMonthlySummary={transactionsMonthlySummary}
            currency={currency}
          />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
          <CurrentMonthSaleCard
            transactionsMonthlySummary={transactionsMonthlySummary}
            currency={currency}
          />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
          <CurrentMonthPurchaseCard
            transactionsMonthlySummary={transactionsMonthlySummary}
            currency={currency}
          />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
          <ArticleCountCard />
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
          <TransactionCard />
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
          <ArticleLowStockCard />
        </Suspense>
      </div>
    </main>
  );
}
