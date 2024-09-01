import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, RefreshCw, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { removeArticle } from "@/lib/articles.actions";
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
import { mutate } from "swr";

type Props = {
  articles: Article[];
  apiUrl: string;
};

const ArticleTable = ({ articles, apiUrl }: Props) => {
  const { toast } = useToast();

  const handleRemoveArticle = async (id: string) => {
    // Optimistic update
    mutate(
      apiUrl,
      (currentArticles: Article[] | undefined) => {
        if (!currentArticles) return [];
        return currentArticles.filter((article: Article) => article.id !== id);
      },
      false // Ne pas revalider immédiatement
    );

    const result = await removeArticle(id);

    if (!result.success) {
      // Rétablir l'état initial en cas d'erreur
      mutate(apiUrl);
      toast({
        variant: "destructive",
        description: `L'article ne peut pas être supprimé car il y a des commandes liés à cet article.`,
      });
      return;
    }

    // Rafraîchir les données après une suppression réussie
    mutate(apiUrl);
    toast({
      description: `L'article a été supprimé avec succès.`,
    });
  };

  if (!articles || !articles.length) {
    return (
      <div className="text-muted-foreground flex items-center mb-6">
        <AlertCircle size={16} className="mr-2" />
        Aucun article
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead className="text-right">Stock virtuel</TableHead>
          <TableHead className="text-right">Non livré</TableHead>
          <TableHead className="text-right">Stock réel</TableHead>
          <TableHead>Unité</TableHead>
          <TableHead className="text-right">Prix d&apos;achat</TableHead>
          <TableHead className="text-right">Prix de vente</TableHead>
          <TableHead className="w-[48px] text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articles.map((article: Article) => (
          <TableRow
            key={article.id}
            className={article.stock <= 10 ? "text-destructive" : ""}
          >
            <TableCell>{article.name}</TableCell>
            <TableCell className="text-right">
              {article.stock + article.notDelivered}
            </TableCell>
            <TableCell className="text-right">{article.notDelivered}</TableCell>
            <TableCell className="text-right">{article.stock}</TableCell>
            <TableCell>{article.unit}</TableCell>
            <TableCell className="text-right">
              {article.purchasePrice.toLocaleString()}
              <span className="ml-2">MGA</span>
            </TableCell>
            <TableCell className="text-right">
              {article.sellingPrice.toLocaleString()}
              <span className="ml-2">MGA</span>
            </TableCell>
            <TableCell>
              <span className="flex gap-2">
                <Button asChild size={"icon"} variant={"outline"}>
                  <Link href={`/articles/${article.id}`}>
                    <RefreshCw className="w-4 h-4" />
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
                        définitivement l&apos;article et ses données de nos
                        serveurs.
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
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ArticleTable;
