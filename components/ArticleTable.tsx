import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
          <TableHead className="text-right">Stock</TableHead>
          <TableHead>Unité</TableHead>
          <TableHead className="text-right">Prix d&apos;achat</TableHead>
          <TableHead className="text-right">Prix de vente</TableHead>
          <TableHead className="w-[48px]">Actions</TableHead>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Link href={`/articles/${article.id}`}>
                      Approvisionnement
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive font-bold">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ArticleTable;
