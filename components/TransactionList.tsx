"use client";

import { LIMIT } from "@/lib/constant";
import { fetcher } from "@/lib/fetcher";
import { FileDown, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import ErrorMessage from "./ErrorMessage";
import MyLoader from "./MyLoader";
import MyPagination from "./MyPagination";
import TransactionTable from "./TransactionTable";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

type Props = {
  currentPage: number;
  userCashDesk: CashDesk;
};

const TransactionList = ({ currentPage, userCashDesk }: Props) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const router = useRouter();

  const {
    data: transactions,
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useSWR(
    `/api/transactions?cashDeskId=${userCashDesk.id}&page=${currentPage}&pageSize=${LIMIT}&startDate=${startDate}&endDate=${endDate}`,
    fetcher
  );

  const { data: allTransactions } = useSWR(
    `/api/transactions?cashDeskId=${userCashDesk.id}&startDate=${startDate}&endDate=${endDate}`,
    fetcher
  );

  const {
    data: transactionsCount,
    isLoading: transactionsCountLoading,
    error: transactionsCountError,
  } = useSWR(
    `/api/transactions/count?cashDeskId=${userCashDesk.id}&startDate=${startDate}&endDate=${endDate}`,
    fetcher
  );

  const handleFilter = () => {
    setStartDate(startDate);
    setEndDate(endDate);
    router.push(`/cashdesks?page=1`);
  };

  const handleExportToPDF = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(
      `Liste des transactions du ${format(
        new Date(startDate),
        "dd/MM/yyyy"
      )} au ${format(new Date(endDate), "dd/MM/yyyy")}`,
      15,
      15
    );

    const tableData = allTransactions.map(
      (transaction: Transaction, index: number) => {
        const { createdAt, label, articles, amount } = transaction;

        // Format date
        const formattedDate = format(new Date(createdAt), "dd/MM/yyyy");

        // Transform label
        let formattedLabel = label;
        if (label === "STOCK IN") {
          formattedLabel = "ACHAT";
        } else if (label === "STOCK OUT") {
          formattedLabel = "VENTE";
        }

        // Get articles names
        const articleNames = articles.map((article) => article.name).join(", ");

        return [index + 1, formattedDate, formattedLabel, articleNames, amount];
      }
    );

    autoTable(doc, {
      head: [["#", "Date", "Libellé", "Article(s)", "Montant (MGA)"]],
      body: tableData,
      startY: 20,
      columnStyles: {
        4: { halign: "right" },
      },
    });

    doc.save(`liste_des_transactions_du_${startDate}_au_${endDate}.pdf`);
  };

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
                  <>
                    <Button onClick={handleFilter}>
                      <Filter size={16} />
                    </Button>
                    <Button onClick={handleExportToPDF}>
                      <FileDown size={16} />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          {(transactionsError || transactionsCountError) && (
            <ErrorMessage errorMessage="Erreur lors du chargement des transactions." />
          )}
        </CardHeader>
        <CardContent>
          {transactionsLoading || transactionsCountLoading ? (
            <MyLoader />
          ) : (
            <TransactionTable transactions={transactions} />
          )}
        </CardContent>
        {transactions && transactionsCount > LIMIT && (
          <CardFooter>
            <MyPagination
              currentPage={currentPage}
              totalItems={transactionsCount}
              path="/cashdesks"
              limit={LIMIT}
            />
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default TransactionList;
