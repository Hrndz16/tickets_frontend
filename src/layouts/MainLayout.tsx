import { Outlet, useNavigate } from "react-router-dom";
import { SidebarMenu } from "../components/SidebarMenu";
import { useAuth } from "../context/AuthContext";

export function MainLayout() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 md:flex">
      <SidebarMenu />

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
          <div>
            <p className="text-sm text-slate-500">Sesion activa</p>
            <p className="font-semibold">
              {user?.nombre} {user?.apellido}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Cerrar sesion
          </button>
        </header>

        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
