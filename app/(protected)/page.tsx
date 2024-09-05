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
import { Store } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: `Accueil`,
};

export default async function HomePage() {
  const userData = await getUserData();

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-4">Tableau de bord</h1>
        <h1 className="text-3xl font-bold mb-4 capitalize flex items-center">
          <Store size={20} className="mr-2" />
          {userData.store.name}
        </h1>
      </div>

      <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
        <div className="w-full lg:w-1/4">
          <Suspense
            fallback={<Skeleton className="h-full w-full rounded-lg" />}
          >
            <CurrentMonthRevenueCard storeId={userData.store.id} />
          </Suspense>
        </div>
        <div className="w-full lg:w-1/4">
          <Suspense
            fallback={<Skeleton className="h-full w-full rounded-lg" />}
          >
            <CurrentMonthSaleCard storeId={userData.store.id} />
          </Suspense>
        </div>
        <div className="w-full lg:w-1/4">
          <Suspense
            fallback={<Skeleton className="h-full w-full rounded-lg" />}
          >
            <CurrentMonthPurchaseCard storeId={userData.store.id} />
          </Suspense>
        </div>
        <div className="w-full lg:w-1/4">
          <Suspense
            fallback={<Skeleton className="h-full w-full rounded-lg" />}
          >
            <ArticleCountCard storeId={userData.store.id} />
          </Suspense>
        </div>
      </div>

      <div className="flex flex-col space-y-4 mt-4 lg:flex-row lg:space-y-0 lg:space-x-4">
        <SaleChart />

        <Suspense
          fallback={
            <Card className="w-full lg:w-2/3">
              <Skeleton className="h-full w-full rounded-lg" />
            </Card>
          }
        >
          <TransactionCard cashDeskId={userData.store.cashDesk.id} />
        </Suspense>

        <Suspense
          fallback={
            <Card className="w-full lg:w-1/3">
              <Skeleton className="h-full w-full rounded-lg" />
            </Card>
          }
        >
          <ArticleLowStockCard storeId={userData.store.id} />
        </Suspense>
      </div>
    </>
  );
}
