"use client";

import { LIMIT } from "@/lib/constant";
import { fetcher } from "@/lib/fetcher";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import ClientTable from "./ClientTable";
import ErrorMessage from "./ErrorMessage";
import MyLoader from "./MyLoader";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

type Props = {
  userStore: Store;
};

const ClientList = ({ userStore }: Props) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    data: clients,
    isLoading: clientsLoading,
    error: clientsError,
  } = useSWR(
    `/api/clients?storeId=${userStore.id}&page=${currentPage}&pageSize=${LIMIT}`,
    fetcher
  );

  const {
    data: clientsCount,
    isLoading: clientsCountLoading,
    error: clientsCountError,
  } = useSWR(`/api/clients/count?storeId=${userStore.id}`, fetcher);

  const totalPages = Math.ceil(clientsCount / (LIMIT || 1));

  console.log("CLIENT", clients);
  console.log("COUNT", clientsCount);

  return (
    <div className="overflow-x-auto mt-4">
      <Card>
        <CardHeader>
          {(clientsError || clientsCountError) && (
            <ErrorMessage errorMessage="Erreur lors du chargement des clients." />
          )}
        </CardHeader>
        <CardContent>
          {clientsLoading || clientsCountLoading ? (
            <MyLoader />
          ) : (
            <ClientTable clients={clients} />
          )}
        </CardContent>
        {clients && clientsCount > LIMIT && (
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

export default ClientList;