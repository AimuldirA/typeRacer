import axios from 'axios';

// .env.local-д VITE_API_URL-т заасан утгыг авч ашиглана
const API_URL = import.meta.env.VITE_API_URL as string;

export type CreateUserParams = {
  data: {
    username: string;
    password: string;
  };
};

export const signup = async (values: CreateUserParams) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signUp`, values.data);
    if (response.status === 201) return response.data;
    throw new Error("Бүртгэл амжилтгүй боллоо");
  } catch (error: any) {
    console.error("API алдаа:", error);
    const errs = error.response?.data?.errors;
    if (Array.isArray(errs)) throw new Error(errs[0]);
    throw new Error("Алдаа гарлаа.");
  }
};

export const login = async (values: CreateUserParams) => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, values.data, {
      withCredentials: true,
    });
    console.log("LOGIN", res.data);
    return res.data;
  } catch (error: any) {
    const errs = error.response?.data?.errors;
    if (Array.isArray(errs)) throw new Error(errs[0]);
    throw new Error("Нэвтрэхэд алдаа гарлаа.");
  }
};

export const logout = async () => {
  try {
    await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    localStorage.removeItem("token");
  } catch (error) {
    console.error("Гарахад алдаа гарлаа", error);
  }
};
