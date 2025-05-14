// getUser.ts

const API_URL = import.meta.env.VITE_API_URL as string;
export interface User {
    id: string;
    username: string;
  }
  
  const getUser = async (): Promise<User | null> => {
    try {
      const res = await fetch(`${API_URL}/auth/getUser`, {
        method: "GET",
        credentials: "include"
      });
  
      if (!res.ok) throw new Error("Failed to fetch user");
  
      const data: User = await res.json();
      return data;
    } catch (error) {
      console.error("User fetch error:", error);
      return null;
    }
  };
  
  export default getUser;
  