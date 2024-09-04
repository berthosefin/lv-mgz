import { CashDeskCurrentAmountCard } from "@/components/CashDeskCurrentAmountCard";
import { CashDeskTotalInCard } from "@/components/CashDeskTotalInCard";
import { CashDeskTotalOutCard } from "@/components/CashDeskTotalOutCard";
import { transactionColumns } from "@/components/TransactionColumn";
import { TransactionDataTable } from "@/components/TransactionDataTable";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserData } from "@/lib/get-user-data";
import { Wallet } from "lucide-react";
import { Suspense } from "react";

export default async function CashDeskPage() {
  const userData = await getUserData();

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Caisse</h1>
        <span className="flex gap-2">
          <Wallet size={20} className="mr-2" />
          {userData.store.name}
        </span>
      </div>
      <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
        <div className="w-full lg:w-1/3">
          <CashDeskCurrentAmountCard
            currentAmount={userData.store.cashDesk.currentAmount}
          />
        </div>
        <div className="w-full lg:w-1/3">
          <Suspense
            fallback={<Skeleton className="h-full w-full rounded-lg" />}
          >
            <CashDeskTotalInCard cashDeskId={userData.store.cashDesk.id} />
          </Suspense>
        </div>
        <div className="w-full lg:w-1/3">
          <Suspense
            fallback={<Skeleton className="h-full w-full rounded-lg" />}
          >
            <CashDeskTotalOutCard cashDeskId={userData.store.cashDesk.id} />
          </Suspense>
        </div>
      </div>
      <TransactionDataTable columns={transactionColumns} />
    </>
  );
}
