import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/constants/page-paths";

import { useTokenStore, useUserStore } from "@/store";

export const useAuth = () => {
  const { token, setToken } = useTokenStore();
  const { setAuthenticated, setUser, isAuthenticated } = useUserStore();
  const navigate = useNavigate();

  const signOut = async () => {
    setAuthenticated(false);
    setUser(null);
    setToken(null);
    navigate(PATHS.SIGNUP, { replace: true });
  };

  return {
    isAuthenticated,
    token,
    signOut,
  };
};
