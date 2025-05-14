// getUser.ts
export interface User {
    id: string;
    username: string;
  }
  
  const getUser = async (): Promise<User | null> => {
    try {
      const res = await fetch("http://localhost:5000/auth/getUser", {
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
  