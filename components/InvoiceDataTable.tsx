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
import { exportInvoiceToPdf } from "@/lib/export-invoice-to-pdf";
import { fetcher } from "@/lib/fetcher";
import { useUserStore } from "@/lib/store";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  FileDown,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";
import { Loader } from "./Loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface InvoiceDataTableProps<Invoice, TValue> {
  columns: ColumnDef<Invoice, TValue>[];
}

export function InvoiceDataTable<TValue>({
  columns,
}: InvoiceDataTableProps<Invoice, TValue>) {
  const { user } = useUserStore.getState();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: LIMIT,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [isPaidFilter, setIsPaidFilter] = useState<string>("all");

  const { data, isLoading } = useSWR(
    `${API_URL}/invoices?storeId=${user?.storeId}&page=${
      pagination.pageIndex
    }&pageSize=${
      pagination.pageSize
    }&clientName=${debouncedSearchTerm}&isPaid=${
      isPaidFilter === "all" ? "" : isPaidFilter
    }`,
    fetcher
  );

  const table = useReactTable({
    data: data?.invoices,
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
      <CardHeader>
        <CardTitle>Factures</CardTitle>
        <CardDescription>Gérez et visualisez vos factures.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Recherche..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
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
                    <TableHead className="text-right">Actions</TableHead>
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
                      <TableCell>
                        <span className="flex justify-end gap-2">
                          <Button asChild size={"icon"} variant={"outline"}>
                            <Link href={`/invoices/${row.original.id}`}>
                              <Edit3 className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            size={"icon"}
                            variant={"outline"}
                            onClick={() => {
                              exportInvoiceToPdf(row.original);
                            }}
                          >
                            <FileDown className="w-4 h-4" />
                          </Button>
                        </span>
                      </TableCell>
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
