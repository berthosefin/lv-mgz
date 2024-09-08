import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getHeaders } from "@/lib/actions/headers";
import { API_URL } from "@/lib/constants";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { transactionColumns } from "./TransactionColumn";
import { Button } from "./ui/button";
import { DataTable } from "./ui/data-table";

const getTransactionsRecents = async (cashDeskId: string) => {
  const res = await fetch(
    `${API_URL}/transactions/?cashDeskId=${cashDeskId}&page=1&pageSize=5`,
    {
      headers: getHeaders(),
      cache: "no-store",
    }
  );

  return await res.json();
};

export const TransactionCard = async ({
  cashDeskId,
}: {
  cashDeskId: string;
}) => {
  const data = await getTransactionsRecents(cashDeskId);

  return (
    <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            Transactions récentes de votre boutique.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/cashdesks">
            Voir tout
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable columns={transactionColumns} data={data.transactions} />
      </CardContent>
    </Card>
  );
};
