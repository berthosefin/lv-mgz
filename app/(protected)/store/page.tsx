import { StoreForm } from "@/components/StoreForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Magasin`,
};

export default async function Invoices() {
  return (
    <main className="gap-4 md:gap-8 md:p-4 sm:flex sm:justify-center">
      <StoreForm />
    </main>
  );
}
