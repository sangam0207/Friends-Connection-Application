import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ConfirmationModal from "./RemoveFriendModal";
import {toast,Toaster} from 'sonner'
import api from "@/services"; 

const ChatSessionCard = ({ session }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      const res = await api.post("/user/remove-friend", { friendId: session.id });
      if (res.data.success) {
        toast.success("Friend removed successfully");
        setIsModalOpen(false);
      } else {
        toast.error(res.data.message || "Failed to remove friend");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove friend. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Toaster theme="dark"/>
      <Card className="bg-[#00000033] hover:bg-black/10 transition mx-6 border-none">
        <div className="flex items-center space-x-1 px-4">
          {/* Avatar Section */}
          <Avatar className="w-14 h-14">
            <AvatarImage
              src={`data:image/jpeg;base64,${session?.profilePic}`}
              alt="Assistant img"
            />
            <AvatarFallback>
              {session.name ? session.name.charAt(0).toUpperCase() : "?"}
            </AvatarFallback>
          </Avatar>

          {/* Content Section */}
          <div className="flex-1">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">
                {session.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-400">
                Software Developer
              </CardDescription>
            </CardHeader>
          </div>

          {/* Actions Section */}
          <div className="flex items-center space-x-2">
            <Button
              className="bg-primary text-white rounded-lg px-4 py-2 w-fit md:w-24"
              onClick={() => setIsModalOpen(true)}
            >
              Remove
            </Button>
          </div>
        </div>
      </Card>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <ConfirmationModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          user={session}
          onConfirm={handleConfirm}
          loading={isLoading}
        />
      )}
    </>
  );
};

export default ChatSessionCard;
