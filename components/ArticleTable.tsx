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

type Props = {
  articles: Article[];
};

const ArticleTable = ({ articles }: Props) => {
  if (!articles || !articles.length) {
    return (
      <div className="text-muted-foreground flex items-center mb-6">
        <AlertCircle size={16} className="mr-2" />
        Aucun article enregistré pour le moment
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
                <Button
                  size={"icon"}
                  variant={"outline"}
                  onClick={() => {
                    removeArticle(article.id);
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

export default ArticleTable;
