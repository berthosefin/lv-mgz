import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchWithAuth } from "@/lib/api-utils";
import { getSession } from "@/lib/get-session";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { transactionColumns } from "./TransactionColumn";
import { Button } from "./ui/button";
import { DataTable } from "./ui/data-table";

export const TransactionCard = async () => {
  const { cashDeskId } = await getSession();
  const params = new URLSearchParams({
    cashDeskId: cashDeskId || "",
    page: "1",
    pageSize: "5",
  });
  const data = await fetchWithAuth(`/transactions?${params.toString()}`);

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
