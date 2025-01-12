import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import UserCard from "./components/FriendRequestCard";
import TableLoader from "@/components/loaders/TableLoader";
import DataNotFound from "@/assets/images/nodata.png";
import api from "@/services";
import{toast,Toaster} from 'sonner'


const FriendRequestList = () => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const [isError, setIsError] = useState(false); 


  useEffect(()=>{
   const fetchUser=async()=>{
    setIsLoading(true)
    try {
      const res=await api.get('/user/friend-request-list');
      console.log(res.data)
      if(res.data.success){
        setIsLoading(false)
        setUsers(res.data.data)
        toast.success("friend request list fetched successfully")
      }
    } catch (error) {
      setIsLoading(false);
      setIsError(true)
      toast.error("Failed to fetch user's list")
    }
   }
   fetchUser()
  },[])

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchValue)
    );
    setUsers(filteredUsers);
  };

  return (
    <Card className="bg-[#FFFFFF0D] shadow-md w-full max-w-full mx-auto border-none rounded-xl mt-2">
      <div className="py-6 flex items-center gap-3 md:gap-0 justify-between px-6">
        <Input
          placeholder="Search..."
          className="w-full md:w-1/2 px-2 py-5 rounded-lg bg-white/10 text-white focus:outline-none"
          onChange={handleSearch}
          value={searchTerm}
        />
      </div>

      {isLoading ? (
        <TableLoader />
      ) : isError ? (
        <div className="flex flex-col items-center gap-6 py-12 px-6">
          <div className="w-3/4 max-w-sm mx-auto rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105">
            <img
              src={DataNotFound}
              alt="No data found"
              className="w-full h-auto rounded-md opacity-90"
            />
          </div>
          <p className="text-center text-white text-lg md:text-xl mt-4 opacity-90">
            No data available.
          </p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center text-white py-12">
          <p>No matching users found.</p>
        </div>
      ) : (
        <div className="space-y-3 py-3">
          <Scrollbars  style={{ height: "600px"}} >
            <div className="space-y-3 py-3 ">
              {users.map((user, index) => (
                <UserCard
                  key={user.id}
                  session={user}
                
                />
              ))}
            </div>
          </Scrollbars>
        </div>
      )}
    </Card>
  );
};

export default FriendRequestList;
