import api from "@/lib/api";
import { LoginFormValues, RegisterFormValues } from "@/schemas/auth-schema";
import { User } from "@/types";

class AuthService {
  
  async login(data: LoginFormValues) {
    const response = await api.post("/auth/login", data);
    return response.data;
  };

  async register(data: RegisterFormValues) {
    const response = await api.post("/auth/register", data);
    return response.data;
  };

  async logout() {
    await api.post("/auth/logout");
  };

  async getProfile() {
    const response = await api.get<User>("/auth/me"); 
    return response.data;
  };

  loginWithGoogle() {
    window.location.href = `${api.defaults.baseURL}/auth/google`;
  };
}

export const authService = new AuthService();