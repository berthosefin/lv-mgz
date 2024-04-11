import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

type Props = {
  articles: Article[];
};

const ArticleTable = ({ articles }: Props) => {
  if (!articles || !articles.length) {
    return (
      <div className="text-muted-foreground flex items-center">
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
          <TableHead className="text-right">Stock</TableHead>
          <TableHead>Unité</TableHead>
          <TableHead className="text-right">Prix d&apos;achat</TableHead>
          <TableHead className="text-right">Prix de vente</TableHead>
          <TableHead className="w-[24px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articles.map((article: Article) => (
          <TableRow
            key={article.id}
            className={article.stock <= 0 ? "text-destructive" : ""}
          >
            <TableCell>{article.name}</TableCell>
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
              <Link href={`/articles/${article.id}`}>
                <RefreshCw size={12} />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ArticleTable;
