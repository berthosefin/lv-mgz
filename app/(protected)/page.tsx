import { ArticlesCountCard } from "@/components/ArticlesCountCard";
import { ArticlesLowStockCard } from "@/components/ArticlesLowStockCard";
import { CurrentMonthPurchasesCard } from "@/components/CurrentMonthPurchasesCard";
import { CurrentMonthRevenueCard } from "@/components/CurrentMonthRevenueCard";
import { CurrentMonthSalesCard } from "@/components/CurrentMonthSalesCard";
import { LastTransactionsCard } from "@/components/LastTransactionsCard";
import { SalesChart } from "@/components/SalesChart";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserSession } from "@/lib/getSession";
import { Store } from "lucide-react";
import { Suspense } from "react";

export default async function Home() {
  const userData = await getUserSession();

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-4">Tableau de bord</h1>
        <h1 className="text-3xl font-bold mb-4 capitalize flex items-center">
          <Store size={20} className="mr-2" />
          {userData.username}
        </h1>
      </div>

      <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
        <div className="w-full lg:w-1/4">
          <Suspense
            fallback={<Skeleton className="h-full w-full rounded-lg" />}
          >
            <CurrentMonthRevenueCard storeId={userData.storeId} />
          </Suspense>
        </div>
        <div className="w-full lg:w-1/4">
          <Suspense
            fallback={<Skeleton className="h-full w-full rounded-lg" />}
          >
            <CurrentMonthSalesCard storeId={userData.storeId} />
          </Suspense>
        </div>
        <div className="w-full lg:w-1/4">
          <Suspense
            fallback={<Skeleton className="h-full w-full rounded-lg" />}
          >
            <CurrentMonthPurchasesCard storeId={userData.storeId} />
          </Suspense>
        </div>
        <div className="w-full lg:w-1/4">
          <Suspense
            fallback={<Skeleton className="h-full w-full rounded-lg" />}
          >
            <ArticlesCountCard storeId={userData.storeId} />
          </Suspense>
        </div>
      </div>

      <div className="flex flex-col space-y-4 mt-4 lg:flex-row lg:space-y-0 lg:space-x-4">
        <SalesChart storeId={userData.storeId} />

        <Suspense
          fallback={
            <Card className="w-full lg:w-2/3">
              <Skeleton className="h-full w-full rounded-lg" />
            </Card>
          }
        >
          <LastTransactionsCard CashDeskId={userData.cashDeskId} />
        </Suspense>

        <Suspense
          fallback={
            <Card className="w-full lg:w-1/3">
              <Skeleton className="h-full w-full rounded-lg" />
            </Card>
          }
        >
          <ArticlesLowStockCard storeId={userData.storeId} />
        </Suspense>
      </div>
    </>
  );
}
