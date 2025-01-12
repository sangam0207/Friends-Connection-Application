import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ConfirmationModal from "./AddFriendModal";
import {toast,Toaster} from 'sonner'
import api from "@/services";
import { useUserStore } from "@/store";
const UserCard = ({ session }) => {
  const[isLoading,setIsLoading]=useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const{user}=useUserStore()
  const handleConfirm=async()=>{
    try {
      setIsLoading(true)
      const res=await api.post('/user/send-request',{recipientId:session._id})
      if(res.data.success){
        setIsLoading(false)
       toast.success("Friend request sent successfully")
       setIsModalOpen(false)
      }
    } catch (error) {
      setIsLoading(false)
      setIsModalOpen(false)
      toast.error("Failed to sent the request")
    }
    
  }
  return (
    <Card className="bg-[#00000033] hover:bg-black/10 transition mx-6 border-none">
    <Toaster theme="dark" />
      <div className="flex items-center space-x-4 px-4">
        {/* Avatar Section */}
        <Avatar className="w-14 h-14">
          <AvatarImage
            src={`data:image/jpeg;base64,${session?.profilePic || ""}`}
            alt="Assistant img"
          />
          <AvatarFallback>
            {session?.name?.charAt(0).toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>

        {/* Content Section */}
        <div className="flex-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">
              {session?.name || "Unknown User"}
            </CardTitle>
            <CardDescription className="text-sm text-gray-400">
              {session?.role || "Software Developer"}
            </CardDescription>
          </CardHeader>
        </div>

        {/* Actions Section */}
        <Button
          className="bg-primary text-white rounded-lg px-4 py-2 w-fit md:w-24"
          onClick={() => setIsModalOpen(true)}
          disabled={session.isFriend||user.name===session.name}
        >
          Add
        </Button>
      </div>

      {/* Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        user={session}
        onConfirm={handleConfirm}
        loading={isLoading}
      />
    </Card>
  );
};

export default UserCard;
