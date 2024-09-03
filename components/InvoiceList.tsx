"use client";

import { LIMIT } from "@/lib/constants";
import { fetcher } from "@/lib/fetcher";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import ErrorMessage from "./ErrorMessage";
import InvoiceTable from "./InvoiceTable";
import MyLoader from "./MyLoader";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { useDebounce } from "use-debounce";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Props = {
  userStore: Store;
};

const InvoiceList = ({ userStore }: Props) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [clientName, setClientName] = useState<string>("");
  const [isPaidFilter, setIsPaidFilter] = useState<string>("all");

  const [debouncedclientName] = useDebounce(clientName, 500);

  const {
    data: invoices,
    isLoading: invoicesLoading,
    error: invoicesError,
  } = useSWR(
    `${API_URL}/invoices?storeId=${
      userStore.id
    }&page=${currentPage}&pageSize=${LIMIT}&clientName=${debouncedclientName}&isPaid=${
      isPaidFilter === "all" ? "" : isPaidFilter
    }`,
    fetcher
  );

  const {
    data: invoicesCount,
    isLoading: invoicesCountLoading,
    error: invoicesCountError,
  } = useSWR(
    `${API_URL}/invoices/count?storeId=${
      userStore.id
    }&clientName=${debouncedclientName}&isPaid=${
      isPaidFilter === "all" ? "" : isPaidFilter
    }`,
    fetcher
  );

  const totalPages = Math.ceil(invoicesCount / (LIMIT || 1));

  return (
    <div className="overflow-x-auto mt-4">
      <Card>
        <CardHeader>
          {(invoicesError || invoicesCountError) && (
            <ErrorMessage errorMessage="Erreur lors du chargement des commandes." />
          )}
          <div className="flex space-x-4">
            <Input
              placeholder="Rechercher par nom du client"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full sm:max-w-xs"
            />
            <Select value={isPaidFilter} onValueChange={setIsPaidFilter}>
              <SelectTrigger className="max-w-32">
                <SelectValue placeholder="Filtrer par état de paiement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="true">Payé</SelectItem>
                <SelectItem value="false">Non payé</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
