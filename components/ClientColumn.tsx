"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ClientRemoveAlertDialog } from "./ClientRemoveAlertDialog";
import { ClientUpdateForm } from "./ClientUpdateForm";

export const clientColumns: ColumnDef<Client>[] = [
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
          <ClientUpdateForm client={client} />
          <ClientRemoveAlertDialog client={client} />
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
