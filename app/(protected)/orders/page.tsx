import OrderList from "@/components/OrderList";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/users";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default async function Orders() {
  const userData: User = await getUser();
  const userStore: Store = userData.store;

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
      <OrderList userStore={userStore} />
    </>
  );
}
