import CashDesk from "@/components/CashDesk";
import TransactionList from "@/components/TransactionList";
import { getUser } from "@/lib/users";
import { Wallet } from "lucide-react";

export default async function CashDeskPage() {
  const userData: User = await getUser();
  const userCashDesk: CashDesk = userData.store.cashDesk;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Caisse</h1>
        {/* <Button asChild>
          <Link href={"/cashdesks/operation"} className="btn">
            <ArrowLeftRight size={16} className="mr-2 h-4 w-4" />
            Dépot / Rétrait
          </Link>
        </Button> */}
        <span className="flex gap-2">
          <Wallet size={20} className="mr-2" />
          {userData.store.name}
        </span>
      </div>
      <CashDesk userCashDesk={userCashDesk} />
      <TransactionList userCashDesk={userCashDesk} />
    </>
  );
}
