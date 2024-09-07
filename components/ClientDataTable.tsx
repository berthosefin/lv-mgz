"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LIMIT } from "@/lib/constants";
import { getClients } from "@/lib/get-clients";
import { useUserStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { ClientAddForm } from "./ClientAddForm";
import { clientColumns } from "./ClientColumn";
import { DataTablePagination } from "./DataTablePagination";
import { Loader } from "./Loader";
import { Input } from "./ui/input";

export function ClientDataTable() {
  const { user } = useUserStore.getState();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: LIMIT,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const { data, isPending } = useQuery({
    queryKey: ["clients", debouncedSearchTerm, pagination.pageIndex],
    queryFn: () =>
      getClients(
        user?.storeId as string,
        pagination.pageIndex,
        pagination.pageSize,
        debouncedSearchTerm
      ),
  });

  const columns = useMemo(() => clientColumns, []);

  const table = useReactTable({
    data: data?.clients,
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
        <ClientAddForm />
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
