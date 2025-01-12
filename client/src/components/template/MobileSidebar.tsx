import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scrollbars } from "react-custom-scrollbars-2";
import { X } from "lucide-react";
import { navIcons } from "@/configs/nav-configs/nav-icons-config";
import { navItems } from "@/configs/nav-configs/nav-items-config";
const menuVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
  closed: {
    x: "-100%",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

export const MobileSidebar = ({ isOpen, toggleMenu }) => {
  return (
    <motion.div
      initial={false}
      animate={isOpen ? "open" : "closed"}
      variants={menuVariants}
      className="fixed top-0 left-0 z-50 h-full w-3/4 md:hidden rounded-2xl backdrop-blur-xl bg-[rgba(0,0,0,0.1)] text-white border border-solid border-[rgba(202,202,202,1)]"
    >
      <Button
        size="icon"
        onClick={toggleMenu}
        variant="ghost"
        className="absolute top-2 right-4 rounded-full text-white z-50 "
      >
        <X size={20} />
      </Button>
      <div className="py-3 px-12 h-[70px]">
        <img src="/img/SentienceLogo.svg" alt="Logo" className="w-12 h-12" />
      </div>
      <div
        className="w-full border-t border-solid border-1"
        style={{
          borderImageSource:
            "linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0.15625) 99.04%)",
          borderImageSlice: 4,
        }}
      ></div>
      <Scrollbars hideTracksWhenNotNeeded autoHide>
        <motion.ul className="flex flex-col py-6 px-10 gap-6 mt-2">
          {navItems.map((item) => (
            <motion.li
              onClick={toggleMenu}
              key={item.key}
              className={`flex items-center gap-4 rounded-md px-4 py-1  text-4xl hover:bg-primary hover:bg-opacity-20 transition-colors duration-200 ease-in-out ${
                window.location.pathname === item.path
                  ? "bg-primary rounded-md px-4 py-1 bg-opacity-20 "
                  : ""
              }`}
            >
              {navIcons[item.key]}
              <Link to={item.path} className="text-lg">
                {item.label}
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </Scrollbars>
    </motion.div>
  );
};
