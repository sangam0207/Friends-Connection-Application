import { FaLinkedin, FaTelegram, FaTwitterSquare } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-stone-900/70 border-none h-12 text-white flex md:flex-row flex-col-reverse justify-center items-center text-sm md:justify-between px-4 sm:px-6 md:px-8 py-2 border-t">
      <p>2024 Friend's App Incorporated</p>
      <div className="flex gap-4 items-center justify-center">
        
        <a href="#">Privacy policy</a>
        <a href="#">Terms & Condition</a>
      </div>
    </footer>
  );
};
