"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArticleRemoveAlertDialog } from "./ArticleRemoveAlertDialog";
import { ArticleUpdateForm } from "./ArticleUpdateForm";

export const articleColumns: ColumnDef<Article>[] = [
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    id: "virtualStock",
    header: () => <div className="text-right">Stock virtuel</div>,
    cell: ({ row }) => {
      const stock: number = row.getValue("stock");
      const notDelivered: number = row.getValue("notDelivered");
      return <div className={`text-right`}>{stock + notDelivered}</div>;
    },
  },
  {
    accessorKey: "notDelivered",
    header: () => <div className="text-right">Non livré</div>,
    cell: ({ row }) => {
      const notDelivered: number = row.getValue("notDelivered");
      return <div className={`text-right`}>{notDelivered}</div>;
    },
  },
  {
    accessorKey: "stock",
    header: () => <div className="text-right">Stock réel</div>,
    cell: ({ row }) => {
      const stock: number = row.getValue("stock");
      return <div className={`text-right`}>{stock}</div>;
    },
  },
  {
    accessorKey: "unit",
    header: "Unité",
    cell: ({ row }) => <div className="capitalize">{row.getValue("unit")}</div>,
  },
  {
    accessorKey: "purchasePrice",
    header: () => <div className="text-right">Prix d&apos;achat</div>,
    cell: ({ row }) => {
      const purchasePrice: number = row.getValue("purchasePrice");
      return (
        <div className={`text-right`}>{purchasePrice.toLocaleString()} MGA</div>
      );
    },
  },
  {
    accessorKey: "sellingPrice",
    header: () => <div className="text-right">Prix de vente</div>,
    cell: ({ row }) => {
      const sellingPrice: number = row.getValue("sellingPrice");
      return (
        <div className={`text-right`}>{sellingPrice.toLocaleString()} MGA</div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const article = row.original;
      return (
        <span className="flex justify-end gap-2">
          <ArticleUpdateForm article={article} />
          <ArticleRemoveAlertDialog article={article} />
        </span>
      );
    },
  },
];
