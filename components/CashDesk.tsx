import {
  getTransactionsTotalIn,
  getTransactionsTotalOut,
} from "@/lib/transactions";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import MyCard from "./MyCard";

const CashDesk = async ({ userCashDesk }: { userCashDesk: CashDesk }) => {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${currentYear}-01-01T00:00:00Z`);
  const endDate = new Date(`${currentYear + 1}-01-01T00:00:00Z`);
  const totalIn = await getTransactionsTotalIn(
    userCashDesk.id,
    startDate,
    endDate
  );
  const totalOut = await getTransactionsTotalOut(
    userCashDesk.id,
    startDate,
    endDate
  );

  return (
    <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
      <div className="w-full lg:w-1/3">
        <MyCard
          title="Solde"
          value={userCashDesk.currentAmount.toLocaleString() + " MGA"}
          description="Solde de caisse"
          icon={<Wallet />}
        />
      </div>
      <div className="w-full lg:w-1/3">
        <MyCard
          title={`Entrées`}
          value={totalIn.toLocaleString() + " MGA"}
          description="Total des Entrées de cette année"
          icon={<ArrowUpRight />}
        />
      </div>
      <div className="w-full lg:w-1/3">
        <MyCard
          title={`Sorties`}
          value={totalOut.toLocaleString() + " MGA"}
          description="Total des Sorties de cette année"
          icon={<ArrowDownRight />}
        />
      </div>
    </div>
  );
};

export default CashDesk;
