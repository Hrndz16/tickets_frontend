import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTickets } from "../hooks/useTickets";
import type { Ticket, TicketPriority, TicketStatus } from "../api/tickets";

const statusOptions: TicketStatus[] = ["ABIERTO", "EN_PROCESO", "PENDIENTE", "RESUELTO", "CERRADO"];
const priorityOptions: TicketPriority[] = ["BAJA", "MEDIA", "ALTA", "CRITICA"];

const statusLabels: Record<TicketStatus, string> = {
  ABIERTO: "Abierto",
  EN_PROCESO: "En proceso",
  PENDIENTE: "Pendiente",
  RESUELTO: "Resuelto",
  CERRADO: "Cerrado",
};

const priorityLabels: Record<TicketPriority, string> = {
  BAJA: "Baja",
  MEDIA: "Media",
  ALTA: "Alta",
  CRITICA: "Critica",
};

const statusStyles: Record<TicketStatus, string> = {
  ABIERTO: "bg-blue-50 text-blue-700 ring-blue-200",
  EN_PROCESO: "bg-amber-50 text-amber-700 ring-amber-200",
  PENDIENTE: "bg-violet-50 text-violet-700 ring-violet-200",
  RESUELTO: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CERRADO: "bg-slate-100 text-slate-700 ring-slate-200",
};

const priorityStyles: Record<TicketPriority, string> = {
  BAJA: "bg-slate-100 text-slate-700 ring-slate-200",
  MEDIA: "bg-sky-50 text-sky-700 ring-sky-200",
  ALTA: "bg-orange-50 text-orange-700 ring-orange-200",
  CRITICA: "bg-red-50 text-red-700 ring-red-200",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function normalize(value: string | null | undefined) {
  return value?.toLowerCase() ?? "";
}

function TicketBadge({ children, className }: { children: string; className: string }) {
  return (
    <span className={`inline-flex min-w-24 justify-center rounded-full px-2 py-1 text-xs font-medium ring-1 ${className}`}>
      {children}
    </span>
  );
}

export function TicketsPage() {
  const { data: tickets = [], isLoading, isError, error } = useTickets();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"TODOS" | TicketStatus>("TODOS");
  const [priority, setPriority] = useState<"TODAS" | TicketPriority>("TODAS");
  const [assignment, setAssignment] = useState<"TODOS" | "ASIGNADOS" | "SIN_ASIGNAR">("TODOS");

  const filteredTickets = useMemo(() => {
    const text = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesText =
        !text ||
        normalize(ticket.titulo).includes(text) ||
        normalize(ticket.categoriaNombre).includes(text) ||
        normalize(ticket.asignadoAUsername).includes(text) ||
        normalize(ticket.asignadoANombreCompleto).includes(text);

      const matchesStatus = status === "TODOS" || ticket.status === status;
      const matchesPriority = priority === "TODAS" || ticket.prioridad === priority;
      const matchesAssignment =
        assignment === "TODOS" ||
        (assignment === "ASIGNADOS" && ticket.asignadoAId) ||
        (assignment === "SIN_ASIGNAR" && !ticket.asignadoAId);

      return matchesText && matchesStatus && matchesPriority && matchesAssignment;
    });
  }, [assignment, priority, search, status, tickets]);

  function clearFilters() {
    setSearch("");
    setStatus("TODOS");
    setPriority("TODAS");
    setAssignment("TODOS");
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium uppercase text-slate-500">Tickets</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">Listado de tickets</h2>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-sm text-slate-500">
            {filteredTickets.length} de {tickets.length} registros
          </p>

          <Link
            to="/tickets/nuevo"
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Nuevo ticket
          </Link>
        </div>
      </div>

      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Buscar</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Titulo, categoria o asignado"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Estado</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as "TODOS" | TicketStatus)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
          >
            <option value="TODOS">Todos</option>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {statusLabels[option]}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Prioridad</span>
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as "TODAS" | TicketPriority)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
          >
            <option value="TODAS">Todas</option>
            {priorityOptions.map((option) => (
              <option key={option} value={option}>
                {priorityLabels[option]}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Asignacion</span>
          <select
            value={assignment}
            onChange={(event) =>
              setAssignment(event.target.value as "TODOS" | "ASIGNADOS" | "SIN_ASIGNAR")
            }
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
          >
            <option value="TODOS">Todas</option>
            <option value="ASIGNADOS">Asignados</option>
            <option value="SIN_ASIGNAR">Sin asignar</option>
          </select>
        </label>

        <div className="md:col-span-4">
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {isLoading && <p className="p-6 text-sm text-slate-500">Cargando tickets...</p>}

        {isError && (
          <p className="p-6 text-sm text-red-700">
            {error instanceof Error ? error.message : "No se pudieron cargar los tickets"}
          </p>
        )}

        {!isLoading && !isError && filteredTickets.length === 0 && (
          <p className="p-6 text-sm text-slate-500">No hay tickets para mostrar.</p>
        )}

        {!isLoading && !isError && filteredTickets.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Titulo</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Estado</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Prioridad</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Categoria</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Asignado</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Fecha</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map((ticket) => (
                  <TicketRow key={ticket.id} ticket={ticket} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

function TicketRow({ ticket }: { ticket: Ticket }) {
  return (
    <tr className="hover:bg-slate-50">
      <td className="max-w-xs px-4 py-3">
        <p className="font-medium text-slate-900">{ticket.titulo}</p>
        <p className="mt-1 line-clamp-2 text-xs text-slate-500">{ticket.descripcion}</p>
      </td>
      <td className="px-4 py-3">
        <TicketBadge className={statusStyles[ticket.status]}>{statusLabels[ticket.status]}</TicketBadge>
      </td>
      <td className="px-4 py-3">
        <TicketBadge className={priorityStyles[ticket.prioridad]}>
          {priorityLabels[ticket.prioridad]}
        </TicketBadge>
      </td>
      <td className="px-4 py-3 text-slate-700">{ticket.categoriaNombre ?? "Sin categoria"}</td>
      <td className="px-4 py-3 text-slate-700">
        {ticket.asignadoANombreCompleto ?? ticket.asignadoAUsername ?? "Sin asignar"}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-slate-700">{formatDate(ticket.createdAt)}</td>
    </tr>
  );
}
