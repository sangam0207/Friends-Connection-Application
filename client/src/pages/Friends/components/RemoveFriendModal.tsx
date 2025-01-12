import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import { FaUserPlus } from "react-icons/fa";
  
  const ConfirmationModal = ({ isOpen, setIsOpen, user, onConfirm, loading }) => {
    return (
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="h-96 md:h-72 bg-[#00000033] text-white rounded-lg">
          <DialogHeader className="flex flex-col items-center space-y-3">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={`data:image/jpeg;base64,${user?.profilePic || ""}`}
                alt={`${user?.name || "User"}'s profile`}
              />
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <DialogTitle className="text-lg font-semibold flex items-center space-x-2">
              <FaUserPlus className="text-pink-600" />
              <span>Remove Friend</span>
            </DialogTitle>
            <p className="text-sm text-gray-400 text-center">
              Do you want to remove{" "}
              <span className="font-semibold text-white">
                {user?.name || "this user"}
              </span>{" "}
              from your friends list?
            </p>
          </DialogHeader>
  
          <DialogFooter className="mt-6 flex flex-col md:flex-row md:justify-center gap-3">
            <Button
              variant="outline"
              className="border-gray-400 text-gray-400 hover:text-white hover:border-white"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-pink-600 text-white hover:bg-pink-700"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "Removing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default ConfirmationModal;
  