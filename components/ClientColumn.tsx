"use client";

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
import { ColumnDef } from "@tanstack/react-table";
import { Edit3, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export const clientColumns = (
  handleDelete: (id: string) => void
): ColumnDef<Client>[] => [
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => formatCellValue(row.getValue("email")),
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
    cell: ({ row }) => formatCellValue(row.getValue("phone")),
  },
  {
    accessorKey: "address",
    header: "Addresse",
    cell: ({ row }) => formatCellValue(row.getValue("phone")),
  },
  {
    accessorKey: "city",
    header: "Ville",
    cell: ({ row }) => formatCellValue(row.getValue("city")),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const client = row.original;
      return (
        <span className="flex justify-end gap-2">
          <Button asChild size="icon" variant="outline">
            <Link href={`/clients/${client.id}`}>
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
                  définitivement le client et ses données de nos serveurs.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(client.id)}
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

const formatCellValue = (value: any) => {
  if (value === null || value === undefined || value === "") {
    return <div className="text-muted-foreground">N/A</div>;
  }

  return value;
};
