import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTransactions } from "@/lib/get-transactions";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { transactioncolumns } from "./TransactionColumn";
import { Button } from "./ui/button";
import { DataTable } from "./ui/data-table";

export const TransactionCard = async ({
  cashDeskId,
}: {
  cashDeskId: string;
}) => {
  const transactions = await getTransactions(cashDeskId, 1, 5);

  return (
    <Card className="w-full lg:w-2/3">
      <CardHeader>
        <div className="flex">
          <div className="flex flex-col gap-2">
            <CardTitle>Transactions</CardTitle>
            <CardDescription>Historique des Transactions.</CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="/cashdesks">
              Voir tout
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={transactioncolumns} data={transactions} />
      </CardContent>
    </Card>
  );
};
