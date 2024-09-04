"use client";

import { ColumnDef } from "@tanstack/react-table";

export const clientColumns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "email",
    header: "email",
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
  },
  {
    accessorKey: "address",
    header: "Addresse",
  },
  {
    accessorKey: "city",
    header: "Ville",
  },
];
