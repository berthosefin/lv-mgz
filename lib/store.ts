import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  user: null | {
    id: string;
    username: string;
    storeId: string;
    cashDeskId: string;
    currency: string;
  };
  setUser: (
    id: string,
    username: string,
    storeId: string,
    cashDeskId: string,
    currency: string
  ) => void;
  unSetUser: () => void;
}

type CartItem = {
  id: string;
  name: string;
  price: number;
  stock: number;
  quantity: number;
};

interface CartStore {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (
        id: string,
        username: string,
        storeId: string,
        cashDeskId: string,
        currency: string
      ) => set({ user: { id, username, storeId, cashDeskId, currency } }),
      unSetUser: () => set({ user: null }),
    }),
    { name: "user-storage" }
  )
);

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) => cartItem.id === item.id
          );
          if (existingItem) {
            return {
              cart: state.cart.map((cartItem) =>
                cartItem.id === item.id
                  ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                  : cartItem
              ),
            };
          }
          return { cart: [...state.cart, item] };
        }),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })),
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    { name: "cart-storage" }
  )
);
