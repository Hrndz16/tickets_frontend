import { http } from "./http";

export type TicketStatus = "ABIERTO" | "EN_PROCESO" | "PENDIENTE" | "RESUELTO" | "CERRADO";
export type TicketPriority = "BAJA" | "MEDIA" | "ALTA" | "CRITICA";

export type Ticket = {
  id: number;
  titulo: string;
  descripcion: string;
  status: TicketStatus;
  prioridad: TicketPriority;
  categoriaId: number | null;
  categoriaNombre: string | null;
  creadoPorId: number;
  creadoPorUsername: string;
  asignadoAId: number | null;
  asignadoAUsername: string | null;
  asignadoANombreCompleto: string | null;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
};

export type CreateTicketRequest = {
  titulo: string;
  descripcion: string;
  prioridad: TicketPriority;
  categoriaId: number | null;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const ticketsApi = {
  async list() {
    const response = await http<ApiResponse<Ticket[]>>("/tickets");
    return response.data;
  },

  async create(data: CreateTicketRequest) {
    const response = await http<ApiResponse<Ticket>>("/tickets", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return response.data;
  },
};
