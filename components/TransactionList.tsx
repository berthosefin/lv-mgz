"use client";

import { LIMIT } from "@/lib/constants";
import { fetcher } from "@/lib/fetcher";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ChevronLeft, ChevronRight, FileDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import ErrorMessage from "./ErrorMessage";
import MyLoader from "./MyLoader";
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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Props = {
  userCashDesk: CashDesk;
};

const TransactionList = ({ userCashDesk }: Props) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const router = useRouter();

  const {
    data: transactions,
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useSWR(
    `${API_URL}/transactions?cashDeskId=${userCashDesk.id}&page=${currentPage}&pageSize=${LIMIT}&startDate=${startDate}&endDate=${endDate}`,
    fetcher
  );

  const { data: allTransactions } = useSWR(
    `${API_URL}/transactions?cashDeskId=${userCashDesk.id}&startDate=${startDate}&endDate=${endDate}`,
    fetcher
  );

  const {
    data: transactionsCount,
    isLoading: transactionsCountLoading,
    error: transactionsCountError,
  } = useSWR(
    `${API_URL}/transactions/count?cashDeskId=${userCashDesk.id}&startDate=${startDate}&endDate=${endDate}`,
    fetcher
  );

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

  const totalPages = Math.ceil(transactionsCount / (LIMIT || 1));

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
                  <Button onClick={handleExportToPDF}>
                    <FileDown size={16} />
                  </Button>
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
          <CardFooter className="flex justify-center space-x-4">
            <Button
              variant={"outline"}
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage == 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant={"outline"} disabled>
              Page {currentPage} / {totalPages}
            </Button>
            <Button
              variant={"outline"}
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage == totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default TransactionList;
