import axios from 'axios';

const API_URL = 'http://localhost:5000/auth';

export type CreateUserParams = {
    data: {
        username: string,
        password: string,
    }
}

export const signup = async (values: CreateUserParams) => {
    try {
        const response = await axios.post(`${API_URL}/signUp`, values.data); 

        if (response.status === 201) {
            return response.data; 
        } else {
            throw new Error("Бүртгэл амжилтгүй боллоо");
        }
    } catch (error: any) {
        console.error("API алдаа:", error);

        if (error.response?.data?.errors) {
            // 🎯 Алдааны массив байгаа үед эхний мессежийг дамжуулна
            throw new Error(error.response.data.errors[0]);
        } else {
            throw new Error("Алдаа гарлаа.");
        }
    }
};

export const login = async (values: CreateUserParams) => {
    try {
        const res = await axios.post(`${API_URL}/login`, values.data, {
            withCredentials: true, //  cookie дамжуулах
        });
        const isAuthenticated = !!localStorage.getItem("token");
        console.log("LOGIN", res.data);
        return res.data;
    }  catch (error: any) {
        // Алдааны мэдээллийг серверээс авах
        const serverErrors = error.response?.data?.errors;
    
        // массив хэлбэртэй байгаа бол хамгийн эхнийг авна
        if (serverErrors && Array.isArray(serverErrors)) {
          throw new Error(serverErrors[0]);
        }
        throw new Error("Нэвтрэхэд алдаа гарлаа.");
    }
};

export const logout = async()=>{
  try{
    await axios.post(`${API_URL}/logout`, {},{
      withCredentials:true
    });
    localStorage.removeItem("token");
  }catch (error) {
    console.error("Гарахад алдаа гарлаа", error);
}
}


