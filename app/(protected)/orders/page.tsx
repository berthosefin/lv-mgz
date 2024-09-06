import { OrderDataTable } from "@/components/OrderDataTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Commandes`,
};

export default async function Orders() {
  return (
    <main className="flex flex-1 flex-col gap-4 md:gap-8 md:p-4">
      <div className="space-y-2 px-2">
        <h1 className="text-2xl font-semibold leading-none tracking-tight">
          Commandes
        </h1>
        <p className="text-sm text-muted-foreground">
          Gérez et visualisez vos commandes.
        </p>
      </div>
      <OrderDataTable />
    </main>
  );
}
