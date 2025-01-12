import { useLayout } from "@/lib/hooks/useLayout";
import { useAuth } from "@/lib/hooks/useAuth";
import { FaPowerOff } from "react-icons/fa";
export const NavBottom = () => {
  const { sideNavCollapsed: isCollapsed } = useLayout();
  const { signOut } = useAuth();
  const handleClick = async () => {
    signOut();
  };
  return (
    <div
      className={`h-[44px] flex items-center gap-2 cursor-pointer hover:bg-black/50 hover:text-gray-100" rounded-md
    ${isCollapsed ? "justify-center" : "ps-3"}
    `}
      onClick={handleClick}
    >
      <FaPowerOff className="text-2xl" />
      {!isCollapsed && <span className="font-medium">Logout</span>}
    </div>
  );
};
