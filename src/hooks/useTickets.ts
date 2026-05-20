import { useQuery } from "@tanstack/react-query";
import { ticketsApi } from "../api/tickets";

export function useTickets() {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: ticketsApi.list,
  });
}
