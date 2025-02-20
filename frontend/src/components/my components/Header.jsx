import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut } from 'lucide-react';
import api, { handleLogout } from "@/config/api";
import { store } from "@/store";
import { logout } from "@/store/authSlice";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

const Header = () => {

  //const { user } = useUser();
  const user = useSelector((state) => state.auth.user); 

  const navigate = useNavigate();

  const handleProfileClick = () => {
    //navigate('/profile');
  };

 /* const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
      store.dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };*/

  return (
    <>
            <div className="flex justify-between items-center mt-10 mb-6 mx-8">
              <h1 className="text-3xl font-bold">Bienvenue, { user ? user?.firstName + " " + user?.lastName : "Guest"}</h1>
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
              <AvatarImage 
                src={user?.avatar || "frontend/src/assets/Blank_avatar.jpeg"} 
                alt="User avatar" 
              />
              <AvatarFallback>UN</AvatarFallback>
             </Avatar>
             </DropdownMenuTrigger>
             <DropdownMenuContent align="end" className="w-35">
             <DropdownMenuItem 
                 onClick={handleProfileClick}
                 className="cursor-pointer"
              >
            <User className="mr-2 h-4 w-4" />
              Profil
            </DropdownMenuItem>
           <DropdownMenuSeparator />
           <DropdownMenuItem 
             onClick={handleLogout}
             className="cursor-pointer text-red-600"
           >
           <LogOut className="mr-2 h-4 w-4" />
            Se déconnecter
           </DropdownMenuItem>
          </DropdownMenuContent>
         </DropdownMenu>
            </div>
    </>
  )
}

export default Header