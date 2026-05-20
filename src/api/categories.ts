import { http } from "./http";

export type Category = {
  id: number;
  nombre: string;
  descripcion: string | null;
  createdAt: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const categoriesApi = {
  async list() {
    const response = await http<ApiResponse<Category[]>>("/categorias");
    return response.data;
  },
};
