import { User } from "@/types/intrerface";
import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

interface UserState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => Promise<void>;
}

type UserPersist = Pick<UserState, "user" | "token">;

const persistConfig: PersistOptions<UserState, UserPersist> = {
  name: "user-data",
  partialize: (state) => ({
    user: state.user,
    token: state.token,
  }),
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: async () => set({ user: null, token: null }),
    }),
    persistConfig
  )
);
