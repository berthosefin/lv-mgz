import { useCartStore } from "@/lib/store";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";

export const ArticleAddToCart = ({ article }: { article: Article }) => {
  const { addToCart } = useCartStore.getState();
  const cart = useCartStore((state) => state.cart);

  const cartItem = cart.find((item) => item.id === article.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = currentQuantity >= article.stock;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart({
        id: article.id,
        name: article.name,
        price: article.sellingPrice,
        stock: article.stock,
        quantity: 1,
      });
    }
  };

  return (
    <Button
      size={"icon"}
      variant={"outline"}
      onClick={() => handleAddToCart()}
      disabled={isOutOfStock}
    >
      <ShoppingCart className="w-4 h-4" />
    </Button>
  );
};
