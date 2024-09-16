"use client";

import { exportInvoiceToPdf } from "@/lib/export-invoice-to-pdf";
import { ColumnDef } from "@tanstack/react-table";
import { FileDown } from "lucide-react";
import { InvoiceUpdateForm } from "./InvoiceUpdateForm";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export const invoiceColumns = (currency: string): ColumnDef<Invoice>[] => [
  {
    accessorKey: "updatedAt",
    header: "Date",
    cell: ({ row }) => {
      const date: Date = row.getValue("updatedAt");
      return new Date(date).toLocaleDateString("fr-FR");
    },
  },
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => {
      const client: Client = row.getValue("client");
      return <div className="capitalize">{client.name}</div>;
    },
  },
  {
    accessorKey: "invoiceItems",
    header: "Article(s)",
    cell: ({ row }) => {
      const invoiceItems: InvoiceItem[] = row.getValue("invoiceItems");
      return (
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
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Montant</div>,
    cell: ({ row }) => {
      const amount: number = row.getValue("amount");
      return (
        <div className={`text-right`}>
          {amount.toLocaleString()} {currency}
        </div>
      );
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
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const invoice = row.original;
      return (
        <span className="flex justify-end gap-2">
          <InvoiceUpdateForm invoice={invoice} currency={currency} />
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={() => {
              exportInvoiceToPdf(invoice, currency);
            }}
          >
            <FileDown className="w-4 h-4" />
          </Button>
        </span>
      );
    },
  },
];
