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

type Props = {
  userStore: Store;
};

const OrderList = ({ userStore }: Props) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError,
  } = useSWR(
    `/api/orders?storeId=${userStore.id}&page=${currentPage}&pageSize=${LIMIT}`,
    fetcher
  );

  const {
    data: ordersCount,
    isLoading: ordersCountLoading,
    error: ordersCountError,
  } = useSWR(`/api/orders/count?storeId=${userStore.id}`, fetcher);

  const totalPages = Math.ceil(ordersCount / (LIMIT || 1));

  return (
    <div className="overflow-x-auto mt-4">
      <Card>
        <CardHeader>
          {(ordersError || ordersCountError) && (
            <ErrorMessage errorMessage="Erreur lors du chargement des commandes." />
          )}
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
