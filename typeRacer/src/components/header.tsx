// import PrivateHeader from "./privateHeader";
// import PublicHeader from "./publicHeader";
// import useAuthStatus from "../hooks/checkAuts";


// export default function Header() {

//     const isLoggedIn = useAuthStatus();
//     return isLoggedIn ? <PrivateHeader /> : <PublicHeader />; 
// }



import { useAuthStatus } from "../hooks/checkAuts";
import PrivateHeader from "./privateHeader";
import PublicHeader from "./publicHeader";

export default function Header() {
  const { isLoggedIn } = useAuthStatus();

  return isLoggedIn ? <PrivateHeader /> : <PublicHeader />;
}




