import { orderColumns } from "@/components/OrderColumn";
import { OrderDataTable } from "@/components/OrderDataTable";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default async function Orders() {
  return (
    <>
      <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:space-y-0 lg:space-x-4">
        <h1 className="text-3xl font-bold">Liste des commandes</h1>
        <div className="flex flex-col space-y-4 lg:flex-row lg:justify-end lg:space-y-0 lg:space-x-4">
          <Button asChild>
            <Link href={"/orders/new"} className="btn">
              <ShoppingCart size={16} className="mr-2 h-4 w-4" />
              Nouvelle commande
            </Link>
          </Button>
        </div>
      </div>
      <OrderDataTable columns={orderColumns} />
    </>
  );
}
