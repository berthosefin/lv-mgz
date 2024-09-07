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
import { removeArticleAction } from "@/lib/actions/remove-article";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useServerAction } from "zsa-react";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

export const ArticleRemoveAlertDialog = ({ article }: { article: Article }) => {
  const { execute } = useServerAction(removeArticleAction);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (id: string) => {
      const [data, err] = await execute({ id });

      if (err) {
        toast({
          title: `${err.code}`,
          description: `${err.message}`,
          variant: `destructive`,
        });
      } else if (data) {
        queryClient.invalidateQueries({ queryKey: ["articles"] });
        toast({
          title: `Suppression réussie`,
          description: `Article supprimé avec succès !`,
        });
      }
    },
  });

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
            définitivement l&apos;article et ses données de nos serveurs.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutate(article.id)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
