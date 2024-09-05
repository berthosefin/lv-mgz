"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { API_URL, LIMIT } from "@/lib/constants";
import { fetcher } from "@/lib/fetcher";
import { useUserStore } from "@/lib/store";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, FileDown } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import { Loader } from "./Loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { exportTransactionsToPdf } from "@/lib/export-transactions-to-pdf";

interface TransactionDataTableProps<Transaction, TValue> {
  columns: ColumnDef<Transaction, TValue>[];
}

export function TransactionDataTable<TValue>({
  columns,
}: TransactionDataTableProps<Transaction, TValue>) {
  const { user } = useUserStore.getState();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: LIMIT,
  });
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { data, isLoading } = useSWR(
    `${API_URL}/transactions?cashDeskId=${user?.cashDeskId}&page=${pagination.pageIndex}&pageSize=${pagination.pageSize}&startDate=${startDate}&endDate=${endDate}`,
    fetcher
  );

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
    <Card className="xl:col-span-1" x-chunk="dashboard-01-chunk-4">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            Liste des transactions de votre boutique.
          </CardDescription>
        </div>
        <div className="ml-auto flex flex-col gap-2 lg:flex-row">
          <Input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full sm:max-w-48"
          />
          <Input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full sm:max-w-48"
          />
          {startDate && endDate && (
            <Button
              onClick={() => {
                exportTransactionsToPdf(data?.transactions, startDate, endDate);
              }}
            >
              <FileDown className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
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
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                {table.getPageCount() === 0
                  ? "Page 1 sur 1"
                  : `Page ${
                      table.getState().pagination.pageIndex + 1
                    } sur ${table.getPageCount()}`}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
