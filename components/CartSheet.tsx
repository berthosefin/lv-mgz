import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { addOrderAction } from "@/lib/actions/orders";
import { useCartStore, useUserStore } from "@/lib/store";
import { useQueryClient } from "@tanstack/react-query";
import { Check, RotateCw, ShoppingCart, Trash, Trash2 } from "lucide-react";
import { useState } from "react";
import { useServerAction } from "zsa-react";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "./ui/use-toast";

export default function CartSheet() {
  const cart = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const [clientName, setClientName] = useState<string>("");
  const [isPaid, setIsPaid] = useState<boolean>(true);
  const [isDelivered, setIsDelivered] = useState<boolean>(true);
  const { user } = useUserStore.getState();
  const queryClient = useQueryClient();
  const { execute, isPending } = useServerAction(addOrderAction);
  const [openSheet, setOpenSheet] = useState(false);

  const handleClearCart = async () => {
    clearCart();
    setClientName("");
  };

  const isQuantityValid = () => {
    return cart.every(
      (item) => item.quantity >= 1 && item.quantity <= item.stock
    );
  };

  const handleSubmitOrder = async () => {
    if (!isQuantityValid()) {
      toast({
        title: "Erreur de quantité",
        description:
          "La quantité de certains articles dépasse les limites autorisées.",
        variant: "destructive",
      });
      return;
    }

    const newOrder = {
      storeId: user?.storeId as string,
      clientName: clientName.toLocaleLowerCase(),
      isPaid,
      isDelivered,
      orderItems: cart.map((item) => ({
        articleId: item.id,
        quantity: item.quantity,
      })),
    };

    const [data, err] = await execute(newOrder);

    if (err) {
      toast({
        title: `${err.code}`,
        description: `${err.message}`,
        variant: `destructive`,
      });
    } else if (data) {
      toast({
        title: "Nouvelle commande",
        description: "La commande a été créée avec succès !",
      });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      clearCart();
      setClientName("");
      setOpenSheet(false);
    }
  };

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger asChild>
        <Button
          aria-label="Panier"
          variant="outline"
          size="icon"
          className="relative rounded-full"
        >
          {itemCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-2 flex items-center justify-center"
            >
              {itemCount}
            </Badge>
          )}
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-4 sm:max-w-lg">
        <SheetHeader className="flex flex-row items-center px-1">
          <SheetTitle>Panier {itemCount > 0 && `(${itemCount})`}</SheetTitle>
          <Input
            className="max-w-48 ml-auto mr-6"
            placeholder="Nom du client"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </SheetHeader>
        <Separator />
        {cart.length > 0 ? (
          <div className="flex flex-1 flex-col gap-5 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="flex flex-col gap-5">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="flex flex-1 flex-col">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-gray-500">
                        {item.price.toFixed(2)} {user?.currency} x{" "}
                        {item.quantity} ={" "}
                        {(item.price * item.quantity).toFixed(2)}{" "}
                        {user?.currency}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Input
                        type="number"
                        min={"1"}
                        max={item.stock}
                        value={item.quantity}
                        onChange={(e) => {
                          const newValue = Math.min(
                            Number(e.target.value),
                            item.stock
                          );
                          updateQuantity(item.id, newValue);
                        }}
                        className="w-[72px]"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          removeFromCart(item.id);
                          setClientName("");
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="mt-auto space-y-4">
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{totalAmount.toFixed(2) + " " + user?.currency}</span>
              </div>
              <div className="flex justify-end gap-2 text-lg font-semibold">
                <Label className="flex items-center text-primary">
                  <Checkbox
                    checked={isPaid}
                    onCheckedChange={(checked) => {
                      if (!checked && !isDelivered) {
                        return;
                      }
                      setIsPaid(checked === true);
                    }}
                    className="mr-2"
                  />
                  Payé
                </Label>
                <Label className="flex items-center text-primary">
                  <Checkbox
                    checked={isDelivered}
                    onCheckedChange={(checked) => {
                      if (!checked && !isPaid) {
                        return;
                      }
                      setIsDelivered(checked === true);
                    }}
                    className="mr-2"
                  />
                  Livré
                </Label>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleClearCart()}
                >
                  <Trash size={16} className="mr-2 h-4 w-4" />
                  Vider
                </Button>
                {isPending ? (
                  <Button disabled className="w-full">
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    Chargement...
                  </Button>
                ) : (
                  <Button
                    disabled={
                      isPending || clientName.trim() === ""
                        ? true
                        : false || !isQuantityValid()
                    }
                    className="w-full"
                    onClick={handleSubmitOrder}
                  >
                    <Check size={16} className="mr-2 h-4 w-4" />
                    Valider
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-muted-foreground">
              Votre panier est vide
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
