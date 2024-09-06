import { CashDeskCurrentAmountCard } from "@/components/CashDeskCurrentAmountCard";
import { CashDeskTotalInCard } from "@/components/CashDeskTotalInCard";
import { CashDeskTotalOutCard } from "@/components/CashDeskTotalOutCard";
import { TransactionDataTable } from "@/components/TransactionDataTable";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserData } from "@/lib/get-user-data";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: `Caisse`,
};

export default async function CashDeskPage() {
  const userData = await getUserData();

  return (
    <main className="flex flex-1 flex-col gap-4 md:gap-8 md:p-4">
      <div className="grid gap-4 md:grid-cols-1 md:gap-8 lg:grid-cols-3">
        <CashDeskCurrentAmountCard
          currentAmount={userData.store.cashDesk.currentAmount}
        />
        <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
          <CashDeskTotalInCard cashDeskId={userData.store.cashDesk.id} />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
          <CashDeskTotalOutCard cashDeskId={userData.store.cashDesk.id} />
        </Suspense>
      </div>
      <div className="gap-4 md:gap-8">
        <TransactionDataTable />
      </div>
    </main>
  );
}
