import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, Edit3, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { removeClient } from "@/lib/clients.actions";

type Props = {
  clients: Client[];
};

const ClientTable = ({ clients }: Props) => {
  if (!clients || !clients.length) {
    return (
      <div className="text-muted-foreground flex items-center mb-6">
        <AlertCircle size={16} className="mr-2" />
        Aucun client enregistré pour le moment
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead className="">Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead className="">Addresse d&apos;achat</TableHead>
          <TableHead className="">Ville</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client: Client) => (
          <TableRow
            key={client.id}
            // className={"text-destructive"}
          >
            <TableCell>{client.name}</TableCell>
            <TableCell className="">{client.email}</TableCell>
            <TableCell>{client.phone}</TableCell>
            <TableCell className="">{client.address}</TableCell>
            <TableCell className="">{client.city}</TableCell>
            <TableCell>
              <span className="flex justify-end gap-2">
                <Button asChild size={"icon"} variant={"outline"}>
                  <Link href={`/clients/${client.id}`}>
                    <Edit3 className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  size={"icon"}
                  variant={"outline"}
                  onClick={() => {
                    removeClient(client.id);
                  }}
                  disabled
                >
                  <Trash className="w-4 h-4 text-destructive" />
                </Button>
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ClientTable;
