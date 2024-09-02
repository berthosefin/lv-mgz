import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import TransactionTable from "./TransactionTable";
import { Button } from "./ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getLastTransactions = async (CashDeskId: string) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const url = `${API_URL}/transactions/?CashDeskId=${CashDeskId}&page=1&pageSize=5`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  return res
    .json()
    .then((json) => json)
    .catch((e) => undefined);
};

export const LastTransactionsCard = async ({
  CashDeskId,
}: {
  CashDeskId: string;
}) => {
  const transactions = await getLastTransactions(CashDeskId);

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
        <TransactionTable transactions={transactions} />
      </CardContent>
    </Card>
  );
};
