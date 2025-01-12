import { lazy } from "react";
import { PATHS } from "@/constants/page-paths";
export interface ProtectedRouteInterface {
  path: string;
  key: string;
  name: string;
  component: React.LazyExoticComponent<() => JSX.Element>;
}

export const protectedRoutes = [
  {
    path: PATHS.HOME,
    name: "home",
    component: lazy(() => import("../../pages/Home")),
    key: "home",
  },
  {
    path: '/friends',
    name: "friends",
    component: lazy(() => import("../../pages/Friends")),
    key: "friends",
  },
  {
    path: '/friend-request',
    name: "friend-request",
    component: lazy(() => import("../../pages/requests")),
    key: "friends-request",
  },
  {
    path: '/profile',
    name: "profile",
    component: lazy(() => import("../../pages/Profile")),
    key: "profile",
  },
  {
    path: '/edit-profile',
    name: "edit-profile",
    component: lazy(() => import("../../pages/Profile/components/EditProfile")),
    key: "edit-profile",
  },
  
];

export const protectedRouteNames = protectedRoutes.map((route) => route.key);

export const protectedRoutePaths = protectedRoutes.map((route) => route.path);

export default protectedRoutes;
