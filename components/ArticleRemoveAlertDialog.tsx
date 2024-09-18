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
import { removeArticleAction } from "@/lib/actions/articles";
import { useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { Button } from "./ui/button";

export const ArticleRemoveAlertDialog = ({ article }: { article: Article }) => {
  const { execute } = useServerAction(removeArticleAction);
  const queryClient = useQueryClient();

  const handleRemoveArticle = async (id: string) => {
    const [data, err] = await execute({ id });

    if (err) {
      toast.error(`${err.code}`, {
        description: `${err.message}`,
      });
    } else if (data) {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success(`Suppression réussie`, {
        description: `Article supprimé avec succès !`,
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
            définitivement l&apos;article et ses données de nos serveurs.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleRemoveArticle(article.id)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
