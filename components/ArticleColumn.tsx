"use client";

import { ColumnDef } from "@tanstack/react-table";

export const articleColumns: ColumnDef<Article>[] = [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    id: "virtualStock",
    header: () => <div className="text-right">Stock virtuel</div>,
    cell: ({ row }) => {
      const stock: number = row.getValue("stock");
      const notDelivered: number = row.getValue("notDelivered");
      const formatted = stock + notDelivered;

      return <div className={`text-right`}>{formatted}</div>;
    },
  },
  {
    accessorKey: "notDelivered",
    header: () => <div className="text-right">Non livré</div>,
    cell: ({ row }) => {
      const notDelivered: number = row.getValue("notDelivered");
      const formatted = notDelivered;

      return <div className={`text-right`}>{formatted}</div>;
    },
  },
  {
    accessorKey: "stock",
    header: () => <div className="text-right">Stock réel</div>,
    cell: ({ row }) => {
      const stock: number = row.getValue("stock");
      const formatted = stock;

      return <div className={`text-right`}>{formatted}</div>;
    },
  },
  {
    accessorKey: "unit",
    header: "Unité",
  },
  {
    accessorKey: "purchasePrice",
    header: () => <div className="text-right">Prix d&apos;achat</div>,
    cell: ({ row }) => {
      const purchasePrice: number = row.getValue("purchasePrice");
      const formatted = purchasePrice.toLocaleString();

      return <div className={`text-right`}>{formatted} MGA</div>;
    },
  },
  {
    accessorKey: "sellingPrice",
    header: () => <div className="text-right">Prix de vente</div>,
    cell: ({ row }) => {
      const sellingPrice: number = row.getValue("sellingPrice");
      const formatted = sellingPrice.toLocaleString();

      return <div className={`text-right`}>{formatted} MGA</div>;
    },
  },
];
