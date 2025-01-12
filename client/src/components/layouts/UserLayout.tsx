import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Suspense } from "react";
import { SideNav } from "@/components/template/sidebar/SideNav";
import Navbar from "../template/Navbar";
import PageLoader from "../template/PageLoader";

const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  
  return (
    <div className="flex flex-auto relative">
      <div className="hidden md:block top-2.5 left-2.5 relative">
        <SideNav />
      </div>
      <div className="w-full relative">
        <Navbar />
        <Suspense fallback={<PageLoader />}>
          <main className="px-0 md:px-6 mt-16 mb-4 mx-6 md:mx-4 overflow-hidden">
            <Outlet />
          </main>
        </Suspense>
      </div>
    </div>
  );
};

export default UserLayout;
