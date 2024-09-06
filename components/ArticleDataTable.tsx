"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { removeArticleAction } from "@/lib/actions/remove-article";
import { API_URL, LIMIT } from "@/lib/constants";
import { fetcher } from "@/lib/fetcher";
import { useUserStore } from "@/lib/store";
import {
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";
import { useServerAction } from "zsa-react";
import { articleColumns } from "./ArticleColumn";
import { DataTablePagination } from "./DataTablePagination";
import { Loader } from "./Loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";

export function ArticleDataTable<TValue>() {
  const { user } = useUserStore.getState();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: LIMIT,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const { data, isLoading, mutate } = useSWR(
    `${API_URL}/articles?storeId=${user?.storeId}&page=${pagination.pageIndex}&pageSize=${pagination.pageSize}&search=${debouncedSearchTerm}`,
    fetcher
  );

  const { execute } = useServerAction(removeArticleAction);

  const handleRemoveArticle = useCallback(
    async (id: string) => {
      const [data, err] = await execute({ id });

      if (err) {
        toast({
          title: `${err.code}`,
          description: `${err.message}`,
          variant: `destructive`,
        });
      } else if (data) {
        toast({
          title: `Suppression d'article`,
          description: `L'article a été supprimé avec succès !`,
        });
        mutate();
      }
    },
    [execute, mutate]
  );

  const columns = useMemo(
    () => articleColumns(handleRemoveArticle),
    [handleRemoveArticle]
  );

  const table = useReactTable({
    data: data?.articles,
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
        <Button className="ml-auto" asChild>
          <Link href={"/articles/add"} className="btn">
            <PlusCircle size={16} className="sm:mr-2 h-4 w-4" />
            <span className="hidden sm:block">Ajouter article</span>
          </Link>
        </Button>
      </div>
      {isLoading ? (
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
