import CashDesk from "@/components/CashDesk";
import TransactionList from "@/components/TransactionList";
import { Button } from "@/components/ui/button";
import { getUserData } from "@/lib/users";
import { ArrowLeftRight } from "lucide-react";
import Link from "next/link";

type Props = {
  searchParams: {
    page: string;
  };
};

export default async function CashDeskPage({ searchParams }: Props) {
  const currentPage = Number(searchParams?.page) || 1;
  const userData: User = await getUserData();
  const userCashDesk: CashDesk = userData.store.cashDesk;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Caisse</h1>
        <Button asChild>
          <Link href={"/cashdesks/operation"} className="btn">
            <ArrowLeftRight size={16} className="mr-2 h-4 w-4" />
            Dépot / Rétrait
          </Link>
        </Button>
      </div>
      <CashDesk userCashDesk={userCashDesk} />
      <TransactionList userCashDesk={userCashDesk} currentPage={currentPage} />
    </>
  );
}
