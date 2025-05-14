
// import { useEffect, useState } from "react";

// const useAuthStatus = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

//   useEffect(() => {
//     fetch("http://localhost:5000/auth/auth-status", {
//       method: "GET",
//       credentials: "include",
//     })
//       .then((res) => res.json())
//       .then((data) => setIsLoggedIn(data.loggedIn))
//       .catch(() => setIsLoggedIn(false));
//   }, []);

//   return isLoggedIn;
// };

// export default useAuthStatus;

// AuthContext.tsx


import useSWR from "swr";

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then(res => res.json());

export const useAuthStatus = () => {
  const { data, mutate } = useSWR("http://localhost:5000/auth/auth-status", fetcher, {
    refreshInterval: 0, // автоматаар дахин шалгахгүй
  });

  return {
    isLoggedIn: data?.loggedIn ?? null,
    refreshAuth: mutate,
  };
};






