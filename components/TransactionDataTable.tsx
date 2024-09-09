"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchWithAuth } from "@/lib/api-utils";
import { exportTransactionsToPdf } from "@/lib/export-transactions-to-pdf";
import { useUserStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { FileDown } from "lucide-react";
import { useMemo, useState } from "react";
import { DataTablePagination } from "./DataTablePagination";
import { Loader } from "./Loader";
import { transactionColumns } from "./TransactionColumn";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";

export function TransactionDataTable() {
  const { user } = useUserStore.getState();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { data, isPending } = useQuery({
    queryKey: ["transactions", pagination.pageIndex, endDate],
    queryFn: () => {
      const params = new URLSearchParams({
        cashDeskId: user?.cashDeskId || "",
        page: pagination.pageIndex.toString(),
        pageSize: pagination.pageSize.toString(),
        startDate,
        endDate,
      });

      return fetchWithAuth(`/transactions?${params.toString()}`);
    },
  });

  const columns = useMemo(() => transactionColumns, []);

  const table = useReactTable({
    data: data?.transactions,
    columns,
    rowCount: data?.total,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  return (
    <Card x-chunk="dashboard-01-chunk-4">
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center">
        <div className="grid gap-2">
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            Liste des transactions de votre boutique.
          </CardDescription>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:ml-auto">
          <Input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full sm:max-w-40"
          />
          <Input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full sm:max-w-40"
          />
          {startDate && endDate && (
            <Button
              onClick={() => {
                exportTransactionsToPdf(data?.transactions, startDate, endDate);
              }}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Loader />
        ) : (
          <>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Aucun résultat.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <DataTablePagination table={table} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
