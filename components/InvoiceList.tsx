"use client";

import { LIMIT } from "@/lib/constant";
import { fetcher } from "@/lib/fetcher";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import ErrorMessage from "./ErrorMessage";
import InvoiceTable from "./InvoiceTable";
import MyLoader from "./MyLoader";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

type Props = {
  userStore: Store;
};

const InvoiceList = ({ userStore }: Props) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    data: invoices,
    isLoading: invoicesLoading,
    error: invoicesError,
  } = useSWR(
    `/api/invoices?storeId=${userStore.id}&page=${currentPage}&pageSize=${LIMIT}`,
    fetcher
  );

  const {
    data: invoicesCount,
    isLoading: invoicesCountLoading,
    error: invoicesCountError,
  } = useSWR(`/api/invoices/count?storeId=${userStore.id}`, fetcher);

  const totalPages = Math.ceil(invoicesCount / (LIMIT || 1));

  return (
    <div className="overflow-x-auto mt-4">
      <Card>
        <CardHeader>
          {(invoicesError || invoicesCountError) && (
            <ErrorMessage errorMessage="Erreur lors du chargement des commandes." />
          )}
        </CardHeader>
        <CardContent>
          {invoicesLoading || invoicesCountLoading ? (
            <MyLoader />
          ) : (
            <InvoiceTable invoices={invoices} />
          )}
        </CardContent>
        {invoices && invoicesCount > LIMIT && (
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

export default InvoiceList;
