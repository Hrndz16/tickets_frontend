import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "../api/http";
import type { TicketPriority } from "../api/tickets";
import { useCategories } from "../hooks/useCategories";
import { useCreateTicket } from "../hooks/useCreateTicket";

const priorityOptions: { value: TicketPriority; label: string }[] = [
  { value: "BAJA", label: "Baja" },
  { value: "MEDIA", label: "Media" },
  { value: "ALTA", label: "Alta" },
  { value: "CRITICA", label: "Critica" },
];

export function CreateTicketPage() {
  const navigate = useNavigate();
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  const createTicket = useCreateTicket();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState<TicketPriority>("MEDIA");
  const [categoriaId, setCategoriaId] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!titulo.trim() || !descripcion.trim()) {
      setError("Titulo y descripcion son obligatorios");
      return;
    }

    try {
      await createTicket.mutateAsync({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        prioridad,
        categoriaId: categoriaId ? Number(categoriaId) : null,
      });

      navigate("/tickets");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("No se pudo crear el ticket");
      }
    }
  }

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium uppercase text-slate-500">Tickets</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">Crear ticket</h2>
        </div>

        <Link
          to="/tickets"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Volver al listado
        </Link>
      </div>

      <form className="space-y-4 rounded-lg border border-slate-200 bg-white p-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Titulo</span>
          <input
            type="text"
            value={titulo}
            onChange={(event) => setTitulo(event.target.value)}
            maxLength={150}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Descripcion</span>
          <textarea
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)}
            rows={5}
            className="mt-1 w-full resize-y rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Prioridad</span>
            <select
              value={prioridad}
              onChange={(event) => setPrioridad(event.target.value as TicketPriority)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Categoria</span>
            <select
              value={categoriaId}
              onChange={(event) => setCategoriaId(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
            >
              <option value="">Sin categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nombre}
                </option>
              ))}
            </select>
            {isLoadingCategories && <p className="mt-1 text-xs text-slate-500">Cargando categorias...</p>}
          </label>
        </div>

        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <Link
            to="/tickets"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={createTicket.isPending}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {createTicket.isPending ? "Guardando..." : "Guardar ticket"}
          </button>
        </div>
      </form>
    </section>
  );
}
