"use client";

import { LIMIT } from "@/lib/constant";
import { fetcher } from "@/lib/fetcher";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import ErrorMessage from "./ErrorMessage";
import MyLoader from "./MyLoader";
import OrderTable from "./OrderTable";
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

const OrderList = ({ userStore }: Props) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [clientName, setClientName] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [debouncedclientName] = useDebounce(clientName, 500);

  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError,
  } = useSWR(
    `${API_URL}/orders?storeId=${
      userStore.id
    }&page=${currentPage}&pageSize=${LIMIT}&clientName=${debouncedclientName}&status=${
      statusFilter === "all" ? "" : statusFilter
    }`,
    fetcher
  );

  const {
    data: ordersCount,
    isLoading: ordersCountLoading,
    error: ordersCountError,
  } = useSWR(
    `${API_URL}/orders/count?storeId=${
      userStore.id
    }&clientName=${debouncedclientName}&status=${
      statusFilter === "all" ? "" : statusFilter
    }`,
    fetcher
  );

  const totalPages = Math.ceil(ordersCount / (LIMIT || 1));

  return (
    <div className="overflow-x-auto mt-4">
      <Card>
        <CardHeader>
          {(ordersError || ordersCountError) && (
            <ErrorMessage errorMessage="Erreur lors du chargement des commandes." />
          )}
          <div className="flex space-x-4">
            <Input
              placeholder="Rechercher par nom du client"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full sm:max-w-xs"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="max-w-32">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="notPaid">Non payé</SelectItem>
                <SelectItem value="notDelivered">Non livré</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {ordersLoading || ordersCountLoading ? (
            <MyLoader />
          ) : (
            <OrderTable orders={orders} />
          )}
        </CardContent>
        {orders && ordersCount > LIMIT && (
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

export default OrderList;
