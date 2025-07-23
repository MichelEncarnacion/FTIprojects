import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../auth/auth";
import { Menu, X } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <>
      {/* Botón hamburguesa visible solo en mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 bg-slate-800 p-2 rounded text-white"
        onClick={() => setOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 min-h-screen w-64 bg-slate-800 text-white z-50 transition-transform transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:block`}
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h1 className="text-xl font-bold">
            Admin<span className="text-blue-400">Panel</span>
          </h1>

          {/* Botón cerrar solo en mobile */}
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nombre del usuario */}
        <div className="px-6 py-3 border-b border-slate-700">
          <p className="text-sm text-gray-300">{user?.name}</p>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
          <Link
            to="/admin/usuarios"
            className="block px-4 py-2 rounded hover:bg-slate-700 transition-colors"
            onClick={() => setOpen(false)}
          >
            Gestión de Usuarios
          </Link>
          {/* Agrega más enlaces si lo necesitas */}
        </nav>

        {/* Botón cerrar sesión */}
        <div className="px-6 py-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Fondo oscuro al abrir sidebar en mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
