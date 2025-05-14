import { Link } from "react-router-dom";

const publicHeader = () =>{
    return(
        <header className="bg-secondary h-[50px] w-full flex items-center justify-end px-10">
                  <nav>
                    <ul className="flex space-x-16 text-white text-lg">
                        <li>
                             <Link to="/" className="hover:text-gray-400">Home</Link>
                        </li>
                        <li>
                            <Link to="/signUP" className="hover:text-gray-400">Sign up</Link>
                        </li>
                        <li>
                            <Link to="/login" className="hover:text-gray-400">Log in</Link>
                        </li>
                    </ul>
                  </nav>
                </header>
)
}

export default publicHeader;