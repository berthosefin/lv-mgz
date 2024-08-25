import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { generatePDF } from "@/lib/invoice2pdf";
import { AlertCircle, Edit3, FileDown } from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

type Props = {
  invoices: Invoice[];
};

const InvoiceTable = ({ invoices }: Props) => {
  if (!invoices || !invoices.length) {
    return (
      <div className="text-muted-foreground flex items-center mb-6">
        <AlertCircle size={16} className="mr-2" />
        Aucune commande enregistrée pour le moment
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Nom du client</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead className="">Articles(s)</TableHead>
          <TableHead className="">Status</TableHead>
          <TableHead className="w-[48px] text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice: Invoice) => (
          <TableRow
            key={invoice.id}
            className={`${invoice.isPaid ? "" : "text-destructive"}`}
          >
            <TableCell>
              {new Date(invoice.updatedAt).toLocaleDateString("fr-FR")}
            </TableCell>
            <TableCell className="capitalize">{invoice.client.name}</TableCell>
            <TableCell>{invoice.amount.toLocaleString()} MGA</TableCell>
            <TableCell className="">
              {invoice.invoiceItems.slice(0, 3).map((item, index) => (
                <span key={index}>
                  {item.article.name}
                  {index < invoice.invoiceItems.slice(0, 3).length - 1 && ", "}
                </span>
              ))}
              {invoice.invoiceItems.length > 3 && " ..."}
            </TableCell>
            <TableCell>
              {invoice.isPaid ? (
                <Badge>Payé</Badge>
              ) : (
                <Badge variant={"destructive"}>Non Payé</Badge>
              )}
            </TableCell>
            <TableCell>
              <span className="flex gap-2">
                <Button asChild size={"icon"} variant={"outline"}>
                  <Link href={`/invoices/${invoice.id}`}>
                    <Edit3 className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  size={"icon"}
                  variant={"outline"}
                  onClick={() => {
                    generatePDF(invoice);
                  }}
                >
                  <FileDown className="w-4 h-4" />
                </Button>
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InvoiceTable;
