
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { InternalAxiosRequestConfig } from "axios";
import { useAuth } from "@/lib/hooks/useAuth";
import api from "@/services";
import { useTokenStore } from "@/store";
import PageLoader from "../loaders/PageLoader";


interface AppConfigContextProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const AppConfigContext = createContext<AppConfigContextProps | undefined>(
  undefined
);

const AppConfigProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { signOut } = useAuth();
  const { token, setToken } = useTokenStore();


  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use(
      (config: InternalAxiosRequestConfig<any>) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          signOut();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [signOut]);

  return (
    <AppConfigContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading ? <PageLoader /> : children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfig = () => {
  const context = useContext(AppConfigContext);
  if (context === undefined) {
    throw new Error("useAppConfig must be used within a AppConfigProvider");
  }
  return context;
};

export default AppConfigProvider;