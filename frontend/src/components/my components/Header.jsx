import { useUser } from '@/context/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import React from 'react'
import { useSelector } from 'react-redux';

const Header = () => {

  //const { user } = useUser();
  const user = useSelector((state) => state.auth.user); 

  return (
    <>
            <div className="flex justify-between items-center mt-10 mb-6 mx-8">
              <h1 className="text-3xl font-bold">Bienvenue, { user ? user?.firstName + " " + user?.lastName : "Guest"}</h1>
              <Avatar>
                <AvatarImage src={user?.avatar || "frontend/src/assets/Blank_avatar.jpeg"} alt="User avatar"  />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
            </div>
    </>
  )
}

export default Header