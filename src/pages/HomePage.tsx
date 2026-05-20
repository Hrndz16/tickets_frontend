import { useAuth } from "../context/AuthContext";

export function HomePage() {
  const { user } = useAuth();

  return (
    <section className="mx-auto max-w-4xl">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase text-slate-500">Panel principal</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Bienvenido, {user?.nombre}</h2>
        <p className="mt-2 text-slate-600">Desde aqui podras continuar con las siguientes partes.</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Usuario</p>
            <p className="font-medium">{user?.username}</p>
          </div>

          <div className="rounded-md border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Rol</p>
            <p className="font-medium">{user?.role}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
