import { Link } from "react-router-dom";
import { Copy } from "lucide-react"
 
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { logout } from "../services/auth.service";
import { useAuthStatus } from "../hooks/checkAuts";
 
// const signOut = ()=>{
//   logout();
// }

const privateHeader = ()=>{
   const { refreshAuth } = useAuthStatus();

   const signOut = async ()=>{
    try{
      await logout();
      await refreshAuth();
    }catch (error){
      console.error("Logout error:", error);
    }
  }

    return(
        <Dialog>
      <DialogTrigger asChild>
        <header className="bg-secondary h-[50px] w-full flex items-center justify-end px-10">
          <nav>
            <ul className="flex space-x-16 text-white text-lg">
                <li>
                     <Link to="/" className="hover:text-gray-400">Home</Link>
                </li>
                <li>
                    <Link to="/profile" className="hover:text-gray-400">Profile</Link>
                </li>
                <li>
                    <button className="hover:text-gray-400">Log Out</button>
                </li>
            </ul>
          </nav>
        </header>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-primary">
        <DialogHeader>
          <DialogDescription>
             Are you sure you want to log out?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <div className="flex items-center space-x-8">
              <button onClick={signOut} className="bg-gradient-to-b from-[#F0E7D8] to-[#E5CEA5]  flex items-center justify-center space-x-4 hover:brightness-90 h-8 w-1/2">Yes</button>
              <button className="bg-gradient-to-b from-[#F0E7D8] to-[#E5CEA5]  flex items-center justify-center space-x-4 hover:brightness-90 h-8 w-1/2">No</button>
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    )
}

export default privateHeader;

