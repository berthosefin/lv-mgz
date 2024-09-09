import { CashDeskCurrentAmountCard } from "@/components/CashDeskCurrentAmountCard";
import { CashDeskTotalInCard } from "@/components/CashDeskTotalInCard";
import { CashDeskTotalOutCard } from "@/components/CashDeskTotalOutCard";
import { TransactionDataTable } from "@/components/TransactionDataTable";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchWithAuth } from "@/lib/api-utils";
import { getSession } from "@/lib/get-session";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: `Caisse`,
};

export default async function CashDeskPage() {
  const { username } = await getSession();
  const user = await fetchWithAuth(`/users/${username}`);

  return (
    <main className="flex flex-1 flex-col gap-4 md:gap-8 md:p-4">
      <div className="grid gap-4 md:grid-cols-1 md:gap-8 lg:grid-cols-3">
        <CashDeskCurrentAmountCard
          currentAmount={user.store.cashDesk.currentAmount}
        />
        <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
          <CashDeskTotalInCard />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
          <CashDeskTotalOutCard />
        </Suspense>
      </div>
      <div className="gap-4 md:gap-8">
        <TransactionDataTable />
      </div>
    </main>
  );
}
