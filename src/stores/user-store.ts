import { create } from "zustand";
import type { User } from "@/types/user";

type UserStore = {
  currentUser: User;
  setCurrentUser(user: User): void;
};

export const useUserStore = create<UserStore>()((set) => ({
  currentUser: {
    id: "",
    name: "",
    username: "",
    email: "",
    createdAt: "",
  },

  setCurrentUser(user) {
    set(() => ({ currentUser: user }));
  },
}));
