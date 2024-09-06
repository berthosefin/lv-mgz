"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "./ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit3, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export const orderColumns = (
  handleDelete: (id: string) => void
): ColumnDef<Order>[] => [
  {
    accessorKey: "updatedAt",
    header: "Date",
    cell: ({ row }) => {
      return new Date(row.getValue("updatedAt")).toLocaleDateString("fr-FR");
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
          <Button asChild size="icon" variant="outline">
            <Link href={`/orders/${order.id}`}>
              <Edit3 className="w-4 h-4" />
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="outline">
                <Trash className="w-4 h-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action ne peut pas être annulée. Cela supprimera
                  définitivement la commande et ses données de nos serveurs.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(order.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </span>
      );
    },
  },
];
