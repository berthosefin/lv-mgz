"use client";

import { API_URL } from "@/lib/constants";
import { exportTransactionsToPdf } from "@/lib/export-transactions-to-pdf";
import { fetcher } from "@/lib/fetcher";
import { useUserStore } from "@/lib/store";
import { FileDown } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import { transactioncolumns } from "./TransactionColumn";
import { DataTable } from "./DataTable";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";

export const TransactionList = () => {
  const { user } = useUserStore.getState();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { data: transactions, isLoading } = useSWR(
    `${API_URL}/transactions?cashDeskId=${user?.cashDeskId}&startDate=${startDate}&endDate=${endDate}`,
    fetcher
  );

  return (
    <div className="overflow-x-auto mt-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:items-center lg:flex-row lg:justify-between lg:space-x-4">
            <CardTitle>Liste des transactions</CardTitle>
            <div className="flex flex-col space-y-4 lg:flex-row lg:justify-end lg:space-y-4 lg:space-x-4">
              <div className="flex flex-row space-x-4 my-4">
                <Input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                {startDate && endDate && (
                  <Button
                    onClick={() => {
                      exportTransactionsToPdf(transactions, startDate, endDate);
                    }}
                  >
                    <FileDown size={16} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-lg" />
          ) : (
            <DataTable columns={transactioncolumns} data={transactions} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
