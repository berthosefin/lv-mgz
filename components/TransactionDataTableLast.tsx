"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

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
import { useMemo } from "react";
import { transactionColumns } from "./TransactionColumn";
import { Loader } from "./Loader";

export function TransactionDataTableLast() {
  const { user } = useUserStore.getState();

  const { data, isPending } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => {
      const params = new URLSearchParams({
        cashDeskId: user?.cashDeskId || "",
        page: "1",
        pageSize: "5",
      });

      return fetchWithAuth(`/transactions?${params.toString()}`);
    },
  });

  const columns = useMemo(
    () => transactionColumns(user?.currency as string),
    [user?.currency]
  );

  const table = useReactTable({
    data: data?.transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md">
      {isPending ? (
        <Loader />
      ) : (
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
