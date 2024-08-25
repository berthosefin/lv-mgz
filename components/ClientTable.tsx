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
import { useToast } from "./ui/use-toast";

type Props = {
  clients: Client[];
};

const ClientTable = ({ clients }: Props) => {
  const { toast } = useToast();

  if (!clients || !clients.length) {
    return (
      <div className="text-muted-foreground flex items-center mb-6">
        <AlertCircle size={16} className="mr-2" />
        Aucun client enregistré pour le moment
      </div>
    );
  }

  const handleRemoveClient = async (id: string) => {
    try {
      await removeClient(id);
      toast({
        description: `Le client a été supprimé avec succès.`,
      });
    } catch (error: any) {
      console.error("Error removing client:", error);
      toast({
        variant: "destructive",
        description: `Le client ne peut pas être supprimé car il a des commandes non payées ou non livrées, ou des factures non payées.`,
      });
    }
  };

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
            <TableCell className="capitalize">{client.name}</TableCell>
            <TableCell className="">{client.email || "N/A"}</TableCell>
            <TableCell>{client.phone || "N/A"}</TableCell>
            <TableCell className="">{client.address || "N/A"}</TableCell>
            <TableCell className="">{client.city || "N/A"}</TableCell>
            <TableCell>
              <span className="flex justify-end gap-2">
                <Button asChild size={"icon"} variant={"outline"}>
                  <Link href={`/clients/${client.id}`}>
                    <Edit3 className="w-4 h-4" />
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size={"icon"} variant={"outline"}>
                      <Trash className="w-4 h-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Êtes-vous absolument sûr ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action ne peut pas être annulée. Cela supprimera
                        définitivement le client et ses données de nos serveurs.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleRemoveClient(client.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ClientTable;
