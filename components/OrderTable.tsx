import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { removeOrder } from "@/lib/orders.actions";
import { AlertCircle, Edit3, Trash } from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
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

type Props = {
  orders: Order[];
};

const OrderTable = ({ orders }: Props) => {
  const { toast } = useToast();

  if (!orders || !orders.length) {
    return (
      <div className="text-muted-foreground flex items-center mb-6">
        <AlertCircle size={16} className="mr-2" />
        Aucune commande
      </div>
    );
  }

  const handleRemoveClient = async (id: string) => {
    const result = await removeOrder(id);

    if (!result.success) {
      toast({
        variant: "destructive",
        description: `La commande ne peut pas être supprimé car il a des commandes non payées ou non livrées.`,
      });
      return;
    }

    toast({
      description: `La commande a été supprimé avec succès.`,
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="">Date</TableHead>
          <TableHead>Nom du client</TableHead>
          <TableHead className="">Articles(s)</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[48px] text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order: Order) => (
          <TableRow
            key={order.id}
            className={order.isPaid ? "" : "text-destructive"}
          >
            <TableCell>
              {new Date(order.updatedAt).toLocaleDateString("fr-FR")}
            </TableCell>
            <TableCell className="capitalize">{order.client.name}</TableCell>
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
              <span className="flex gap-2">
                {order.isPaid ? (
                  <Badge>Payé</Badge>
                ) : (
                  <Badge variant={"destructive"}>Non Payé</Badge>
                )}
                {order.isDelivered ? (
                  <Badge>Livré</Badge>
                ) : (
                  <Badge variant={"destructive"}>Non Livré</Badge>
                )}
              </span>
            </TableCell>
            <TableCell>
              <span className="flex gap-2">
                <Button asChild size={"icon"} variant={"outline"}>
                  <Link href={`/orders/${order.id}`}>
                    <Edit3 className="w-4 h-4" />
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
                        définitivement la commande et ses données de nos
                        serveurs.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleRemoveClient(order.id)}
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

export default OrderTable;
