import { Suspense } from "react";
import { Footer } from "../template/Footer";
import { Outlet } from "react-router-dom";
import AuthLogo from "../shared/AuthLogo";

const AuthLayout = () => {
  return (
    <Suspense>
      <div className="flex flex-col relative justify-between min-h-screen overflow-hidden overflow-y-auto">
        <main className="flex justify-center items-center lg:gap-12 min-h-[calc(100vh-3rem)] pb-24">
          <AuthLogo />
          <div className="relative flex flex-col lg:flex-row items-center justify-center gap-12 xl:gap-32 bg-stone-700/15 z-50 top-10 md:top-20 my-auto py-10 md:py-20 px-6 rounded-3xl shadow-lg w-[85%] md:w-[50%] min-h-[85%]">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </Suspense>
  );
};

export default AuthLayout;
