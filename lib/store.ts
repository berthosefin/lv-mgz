import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  user: null | {
    id: string;
    username: string;
    storeId: string;
    cashDeskId: string;
  };
  setUser: (
    id: string,
    username: string,
    storeId: string,
    cashDeskId: string
  ) => void;
  unSetUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (
        id: string,
        username: string,
        storeId: string,
        cashDeskId: string
      ) => set({ user: { id, username, storeId, cashDeskId } }),
      unSetUser: () => set({ user: null }),
    }),
    { name: "user-storage" }
  )
);
