import { NavLink } from "react-router-dom";

const menuItems = [{ to: "/", label: "Inicio" }];

export function SidebarMenu() {
  return (
    <aside className="w-full border-b border-slate-200 bg-white px-4 py-3 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <h1 className="text-lg font-semibold text-slate-900">Tickets</h1>

      <nav className="mt-4 flex gap-2 md:flex-col">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                "rounded-md px-3 py-2 text-sm font-medium",
                isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
