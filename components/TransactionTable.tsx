import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle } from "lucide-react";

type Props = {
  transactions: Transaction[];
};

const TransactionTable = ({ transactions }: Props) => {
  if (!transactions || !transactions.length) {
    return (
      <div className="text-muted-foreground flex items-center">
        <AlertCircle size={16} className="mr-2" />
        Aucune transaction enregistrée pour le moment
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[96px]">Libellé</TableHead>
          <TableHead>Article(s)</TableHead>
          <TableHead className="text-end">Montant</TableHead>
          <TableHead className="text-end">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow
            key={transaction.id}
            className={transaction.type === "IN" ? "" : "text-destructive"}
          >
            <TableCell>{transaction.label}</TableCell>
            <TableCell>
              {transaction.articles.length > 0 ? (
                <>
                  {transaction.articles.slice(0, 3).map((article, index) => (
                    <span key={index}>
                      {article.name}
                      {index !== transaction.articles.slice(0, 3).length - 1 &&
                        ", "}
                    </span>
                  ))}
                  {transaction.articles.length > 3 && " ..."}
                </>
              ) : (
                <span className="line-through">Article</span>
              )}
            </TableCell>
            <TableCell className="text-end">
              {transaction.amount.toLocaleString()}
              <span className="ml-2">MGA</span>
            </TableCell>
            <TableCell className="text-end">
              {new Date(transaction.createdAt).toLocaleDateString("fr-FR")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TransactionTable;
