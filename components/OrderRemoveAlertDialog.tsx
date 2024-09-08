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
import { removeOrderAction } from "@/lib/actions/remove-order";
import { useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useServerAction } from "zsa-react";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

export const OrderRemoveAlertDialog = ({ order }: { order: Order }) => {
  const { execute } = useServerAction(removeOrderAction);
  const queryClient = useQueryClient();

  const handleRemoveOrder = async (id: string) => {
    const [data, err] = await execute({ id });

    if (err) {
      toast({
        title: `${err.code}`,
        description: `${err.message}`,
        variant: `destructive`,
      });
    } else if (data) {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({
        title: `Suppression réussie`,
        description: `Order supprimé avec succès !`,
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size={"icon"} variant={"outline"}>
          <Trash className="w-4 h-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Cela supprimera
            définitivement l&apos;order et ses données de nos serveurs.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleRemoveOrder(order.id)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
