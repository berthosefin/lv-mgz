import { InvoiceDataTable } from "@/components/InvoiceDataTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Factures`,
};

export default async function Invoices() {
  return (
    <main className="flex flex-1 flex-col gap-4 md:gap-8 md:p-4">
      <div className="space-y-2 px-2">
        <h1 className="text-2xl font-semibold leading-none tracking-tight">
          Factures
        </h1>
        <p className="text-sm text-muted-foreground">
          Gérez et visualisez vos factures.
        </p>
      </div>
      <InvoiceDataTable />
    </main>
  );
}
