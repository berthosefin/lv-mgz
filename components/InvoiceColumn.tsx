"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "./ui/badge";

export const invoiceColumns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "updatedAt",
    header: "Date",
    cell: ({ row }) => {
      const date: Date = row.getValue("updatedAt");
      const formatted = new Date(date).toLocaleDateString("fr-FR");

      return formatted;
    },
  },
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => {
      const client: Client = row.getValue("client");
      const formatted = client.name;

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "invoiceItems",
    header: "Article(s)",
    cell: ({ row }) => {
      const invoiceItems: InvoiceItem[] = row.getValue("invoiceItems");
      const formatted = (
        <>
          {invoiceItems.slice(0, 3).map((item, index) => (
            <span key={index}>
              {item.article.name}
              {index < invoiceItems.slice(0, 3).length - 1 && ", "}
            </span>
          ))}
          {invoiceItems.length > 3 && " ..."}
        </>
      );

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Montant (MGA)</div>,
    cell: ({ row }) => {
      const amount: number = row.getValue("amount");
      const formatted = amount.toLocaleString();

      return <div className={`text-right`}>{formatted} MGA</div>;
    },
  },
  {
    accessorKey: "isPaid",
    header: "Paiement",
    cell: ({ row }) => {
      const isPaid: boolean = row.getValue("isPaid");
      return (
        <>
          {isPaid ? (
            <Badge variant={"outline"}>Payé</Badge>
          ) : (
            <Badge variant={"outline"}>
              <span className="text-destructive">Non Payé</span>
            </Badge>
          )}
        </>
      );
    },
  },
];
