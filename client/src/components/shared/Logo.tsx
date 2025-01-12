import { useLayout } from "@/lib/hooks/useLayout";

export const Logo = () => {
  const { sideNavCollapsed: isCollapsed } = useLayout();
  return (
    <div className="flex items-center justify-center h-[70px] mt-4 mb-4">
      <img
        src="/img/SentienceLogo.svg"
        alt="Logo"
        className="w-14 h-14" 
      />
      {!isCollapsed && (
        <h2 className="ml-2 ">
          Friends
        </h2>
      )}
    </div>
  );
};
