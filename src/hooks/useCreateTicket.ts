import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketsApi, type CreateTicketRequest } from "../api/tickets";

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTicketRequest) => ticketsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}
