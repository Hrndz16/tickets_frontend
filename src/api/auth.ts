import { http } from "./http";

export type Role = "ADMIN" | "TECNICO" | "USUARIO";

export type LoginRequest = {
  username: string;
  password: string;
};

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  role: Role;
};

export type AuthSession = AuthUser & {
  token: string;
  type: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const authApi = {
  async login(credentials: LoginRequest) {
    const response = await http<ApiResponse<AuthSession>>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      skipAuth: true,
    });

    return response.data;
  },
};
