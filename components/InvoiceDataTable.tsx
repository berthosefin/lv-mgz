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
import { useUserStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { FileText, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { DataTablePagination } from "./DataTablePagination";
import { invoiceColumns } from "./InvoiceColumn";
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

export function InvoiceDataTable() {
  const { user } = useUserStore.getState();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [isPaidFilter, setIsPaidFilter] = useState<string>("all");

  const { data, isPending } = useQuery({
    queryKey: [
      "invoices",
      debouncedSearchTerm,
      isPaidFilter,
      pagination.pageIndex,
    ],
    queryFn: () => {
      const params = new URLSearchParams({
        storeId: user?.storeId || "",
        page: pagination.pageIndex.toString(),
        pageSize: pagination.pageSize.toString(),
        clientName: debouncedSearchTerm,
        isPaid: isPaidFilter,
      });

      return fetchWithAuth(`/invoices?${params.toString()}`);
    },
  });

  const columns = useMemo(() => invoiceColumns, []);

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
    <div className="overflow-x-auto px-2">
      <div className="flex items-center py-2 gap-2">
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
        <Button className="ml-auto" asChild>
          <Link href={"/cashdesks"} className="btn">
            <FileText size={16} className="sm:mr-2 h-4 w-4" />
            <span className="hidden sm:block">List des transactions</span>
          </Link>
        </Button>
      </div>
      {isPending ? (
        <div className="rounded-md border">
          <Loader />
        </div>
      ) : (
        <>
          <div className="rounded-md border">
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
          </div>
          <DataTablePagination table={table} />
        </>
      )}
    </div>
  );
}
