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
import { removeClientAction } from "@/lib/actions/clients";
import { useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { Button } from "./ui/button";

export const ClientRemoveAlertDialog = ({ client }: { client: Client }) => {
  const { execute } = useServerAction(removeClientAction);
  const queryClient = useQueryClient();

  const handeleRemoveClient = async (id: string) => {
    const [data, err] = await execute({ id });

    if (err) {
      toast.error(`${err.code}`, {
        description: `${err.message}`,
      });
    } else if (data) {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success(`Suppression réussie`, {
        description: `Client supprimé avec succès !`,
      });
    }
  };

  return (
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
            onClick={() => handeleRemoveClient(client.id)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
