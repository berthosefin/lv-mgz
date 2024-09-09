"use client";

import { ColumnDef } from "@tanstack/react-table";
import { OrderRemoveAlertDialog } from "./OrderRemoveAlertDialog";
import { OrderUpdateForm } from "./OrderUpdateForm";
import { Badge } from "./ui/badge";

export const orderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "updatedAt",
    header: "Date",
    cell: ({ row }) =>
      new Date(row.getValue("updatedAt")).toLocaleDateString("fr-FR"),
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
    accessorKey: "orderItems",
    header: "Article(s)",
    cell: ({ row }) => {
      const orderItems: OrderItem[] = row.getValue("orderItems");
      return (
        <>
          {orderItems.slice(0, 3).map((item, index) => (
            <span key={index}>
              {item.article.name}
              {index < orderItems.slice(0, 3).length - 1 && ", "}
            </span>
          ))}
          {orderItems.length > 3 && " ..."}
        </>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Montant</div>,
    cell: ({ row }) => {
      const orderItems: OrderItem[] = row.getValue("orderItems");
      const totalAmount = orderItems.reduce(
        (total, item) => total + item.article.sellingPrice * item.quantity,
        0
      );
      return (
        <div className={`text-right`}>{totalAmount.toLocaleString()} MGA</div>
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
    accessorKey: "isDelivered",
    header: "Livraison",
    cell: ({ row }) => {
      const isDelivered: boolean = row.getValue("isDelivered");
      return (
        <>
          {isDelivered ? (
            <Badge variant={"outline"}>Livré</Badge>
          ) : (
            <Badge variant={"outline"}>
              <span className="text-destructive">Non Livré</span>
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
      const order = row.original;
      return (
        <span className="flex justify-end gap-2">
          <OrderUpdateForm order={order} />
          <OrderRemoveAlertDialog order={order} />
        </span>
      );
    },
  },
];
