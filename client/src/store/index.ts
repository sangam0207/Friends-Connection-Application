import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  profileSlice,
  ProfileSlice,
  TokenSlice,
  tokenSlice,
  userSlice,
  UserSlice,
} from "./slices/user.slice";


export const useUserStore = create<UserSlice>()(
  persist(
    (...a) => ({
      ...userSlice(...a),
    }),
    { name: "user-store" }
  )
);

export const useProfileStore = create<ProfileSlice>()((...a) => ({
  ...profileSlice(...a),
}));

export const useTokenStore = create<TokenSlice>()(
  persist(
    (...a) => ({
      ...tokenSlice(...a),
    }),
    { name: "auth-store" }
  )
);
