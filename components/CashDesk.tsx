import {
  getAllTransactions,
  getTransactionsTotalIn,
  getTransactionsTotalOut,
} from "@/lib/transactions";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import MyCard from "./MyCard";

const CashDesk = async ({ userCashDesk }: { userCashDesk: CashDesk }) => {
  const transactions = await getAllTransactions(userCashDesk.id);
  const totalIn = await getTransactionsTotalIn(transactions);
  const totalOut = await getTransactionsTotalOut(transactions);

  return (
    <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
      <div className="w-full lg:w-1/3">
        <MyCard
          title="Solde de caisse"
          value={userCashDesk.currentAmount.toLocaleString() + " MGA"}
          icon={<Wallet />}
        />
      </div>
      <div className="w-full lg:w-1/3">
        <MyCard
          title={`Total des entrées`}
          value={totalIn.toLocaleString() + " MGA"}
          icon={<ArrowUpRight />}
        />
      </div>
      <div className="w-full lg:w-1/3">
        <MyCard
          title={`Total des sorties`}
          value={totalOut.toLocaleString() + " MGA"}
          icon={<ArrowDownRight />}
        />
      </div>
    </div>
  );
};

export default CashDesk;
