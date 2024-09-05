import { ArticleCountCard } from "@/components/ArticleCountCard";
import { ArticleLowStockCard } from "@/components/ArticleLowStockCard";
import { CurrentMonthPurchaseCard } from "@/components/CurrentMonthPurchaseCard";
import { CurrentMonthRevenueCard } from "@/components/CurrentMonthRevenueCard";
import { CurrentMonthSaleCard } from "@/components/CurrentMonthSaleCard";
import { SaleChart } from "@/components/SaleChart";
import { TransactionCard } from "@/components/TransactionCard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserData } from "@/lib/get-user-data";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: `Accueil`,
};

export default async function HomePage() {
  const userData = await getUserData();

  return (
    <main className="flex flex-1 flex-col gap-4 md:gap-8 md:p-4">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
          <CurrentMonthRevenueCard storeId={userData.store.id} />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
          <CurrentMonthSaleCard storeId={userData.store.id} />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
          <CurrentMonthPurchaseCard storeId={userData.store.id} />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
          <ArticleCountCard storeId={userData.store.id} />
        </Suspense>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-4">
        <Suspense
          fallback={
            <Card className="lg:col-span-2" x-chunk="dashboard-01-chunk-4">
              <Skeleton className="h-full w-full rounded-lg" />
            </Card>
          }
        >
          <TransactionCard cashDeskId={userData.store.cashDesk.id} />
        </Suspense>

        <SaleChart />

        <Suspense
          fallback={
            <Card className="xl:col-span-1" x-chunk="dashboard-01-chunk-4">
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
