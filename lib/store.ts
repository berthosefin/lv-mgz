import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  user: null | {
    id: string;
    username: string;
  };
  setUser: (id: string, username: string) => void;
  unSetUser: (id: string, username: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (id: string, username: string) =>
        set({ user: { id, username } }),
      unSetUser: () => set({ user: null }),
    }),
    { name: "user-storage" }
  )
);
