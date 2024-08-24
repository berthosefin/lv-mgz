import InvoiceList from "@/components/InvoiceList";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/users";
import { FileText } from "lucide-react";
import Link from "next/link";

export default async function Invoices() {
  const userData: User = await getUser();
  const userStore: Store = userData.store;

  return (
    <>
      <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:space-y-0 lg:space-x-4">
        <h1 className="text-3xl font-bold">Liste des factures</h1>
        <div className="flex flex-col space-y-4 lg:flex-row lg:justify-end lg:space-y-0 lg:space-x-4">
          <Button asChild>
            <Link href={"/invoices/headers"} className="btn">
              <FileText size={16} className="mr-2 h-4 w-4" />
              En-têtes des factures
            </Link>
          </Button>
        </div>
      </div>
      <InvoiceList userStore={userStore} />
    </>
  );
}
