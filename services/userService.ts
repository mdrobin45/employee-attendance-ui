import { AUTH_LOGIN_URL } from "@/lib/constant";
import apiClient from "./apiClient";

export const userLogin = async (email: string, password: string) => {
   const response = await apiClient.post(AUTH_LOGIN_URL, {
      email,
      password,
   });
   return response.data;
};
