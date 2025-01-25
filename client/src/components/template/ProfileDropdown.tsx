import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetProfile } from "@/lib/hooks/api/profile.hook";
import { useAuth } from "@/lib/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useTokenStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { IoMdNotifications } from "react-icons/io";
import { ProfileDropdownSkeleton } from "../loaders/ProfileDropDownLoader";
import { io } from "socket.io-client";
import { useUserStore } from "@/store";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function ProfileDropdown() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { count, setCount } = useUserStore();
  const { token } = useTokenStore();
  const { data: userProfile, isLoading } = useGetProfile({ enabled: !!token });
  const socket = io(import.meta.env.VITE_API_BASE_URL);

  const handleSignOut = () => {
    signOut();
  };

  useEffect(() => {
    if (userProfile?.data?.data?._id) {
      socket.emit("join", userProfile?.data?.data._id);

      socket.on("friend-request-received", (data) => {
        console.log("Friend request received:", data);
        setCount(data.totalRequest);
        const audio = new Audio("/img/notification.wav"); 
        audio.play();
        toast.info(`New Friend Request from ${data.senderName}`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [userProfile?.data?.data?._id]);

  if (isLoading) {
    return <ProfileDropdownSkeleton />;
  }

  const { name = "", profilePic = "" } = userProfile?.data?.data || {};

  return (
    <>
      <div
        className="mr-[-14px]"
        style={{ position: "relative", display: "inline-block" }}
        onClick={() => navigate("/friend-request")}
      >
        <IoMdNotifications size={36} />
        {count > 0 && (
          <div
            style={{
              position: "absolute",
              top: -5,
              right: -5,
              backgroundColor: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: "12px",
            }}
          >
            {count}
          </div>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center h-full rounded-none gap-4"
          >
            <Avatar>
              <AvatarImage
                src={
                  profilePic
                    ? `data:image/jpeg;base64,${profilePic}`
                    : undefined
                }
                alt="user"
                className="w-full h-full object-cover"
              />
              <AvatarFallback className="uppercase">{name[0]}</AvatarFallback>
            </Avatar>
            <div className="text-left hidden sm:block">
              <p>{name}</p>
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuItem onClick={() => navigate("/profile")}>
            My Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="w-full cursor-pointer"
            onClick={handleSignOut}
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ToastContainer />
    </>
  );
}
