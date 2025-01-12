import { lazy } from "react";

import { PATHS } from "../../constants/page-paths";

export const publicRoutes = [
 
  {
    path: PATHS.LOGIN,
    name: "Login",
    component: lazy(() => import("../../pages/auth/Login")),
    key: "login",
  },
  {
    path: PATHS.SIGNUP,
    name: "Signup",
    component: lazy(() => import("../../pages/auth/Signup")),
    key: "signup",
  }
];

export const publicRouteNames = publicRoutes.map((route) => route.name);

export const publicRoutePaths = publicRoutes.map((route) => route.path);

export default publicRoutes;
