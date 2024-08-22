import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, Edit3, Trash } from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

type Props = {
  orders: Order[];
};

const OrderTable = ({ orders }: Props) => {
  if (!orders || !orders.length) {
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
          <TableHead>Nom du client</TableHead>
          <TableHead>Payement</TableHead>
          <TableHead className="">Livraison</TableHead>
          <TableHead className="">Articles(s)</TableHead>
          <TableHead className="">Date</TableHead>
          <TableHead className="w-[48px] text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order: Order) => (
          <TableRow
            key={order.id}
            className={order.isPaid ? "" : "text-destructive"}
          >
            <TableCell>{order.client.name}</TableCell>
            <TableCell>
              {order.isPaid ? (
                <Badge>Payé</Badge>
              ) : (
                <Badge variant={"destructive"}>Non payé</Badge>
              )}
            </TableCell>
            <TableCell className="">
              {order.isDelivered ? (
                <Badge>Livré</Badge>
              ) : (
                <Badge variant={"destructive"}>Non livré</Badge>
              )}
            </TableCell>
            <TableCell className="">
              {order.orderItems.slice(0, 3).map((item, index) => (
                <span key={index}>
                  {item.article.name}
                  {index < order.orderItems.slice(0, 3).length - 1 && ", "}
                </span>
              ))}
              {order.orderItems.length > 3 && " ..."}
            </TableCell>
            <TableCell>
              {new Date(order.createdAt).toLocaleDateString("fr-FR")}
            </TableCell>
            <TableCell>
              <span className="flex gap-2">
                <Button asChild size={"icon"} variant={"outline"}>
                  <Link href={`/orders/${order.id}`}>
                    <Edit3 className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild size={"icon"} variant={"outline"}>
                  <Link href={`#`}>
                    <Trash className="w-4 h-4 text-destructive" />
                  </Link>
                </Button>
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrderTable;
