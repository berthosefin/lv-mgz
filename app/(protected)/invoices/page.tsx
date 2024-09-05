import { invoiceColumns } from "@/components/InvoiceColumn";
import { InvoiceDataTable } from "@/components/InvoiceDataTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Liste des factures`,
};

export default async function Invoices() {
  return (
    <main className="flex flex-1 flex-col gap-4 md:gap-8 md:p-4">
      <div className="gap-4 md:gap-8">
        <InvoiceDataTable columns={invoiceColumns} />
      </div>
    </main>
  );
}
