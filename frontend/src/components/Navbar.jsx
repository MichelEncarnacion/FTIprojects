// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { isLogged, getUser, logout } from "../auth/auth";
import { useState } from "react";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();
  const user = getUser();
  const [openSaps, setOpenSaps] = useState(false);

  // Mostrar enlaces solo en rutas públicas: Home ("/") y todas las "/saps/*"
  const isPublicRoute =
    location.pathname === "/" ||
    location.pathname.startsWith("/saps");

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  const sapsItems = [
    { label: "Trabajo y Competitividad Sostenible", to: "/saps/trabajo-competitividad" },
    { label: "Vida y Salud", to: "/saps/vida-salud" },
    { label: "STEM", to: "/saps/stem" },
    { label: "Desarrollo Humano y Social", to: "/saps/desarrollo-humano" },
  ];

  return (
    <header className="w-screen bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4 flex justify-between items-center relative">
        {/* Logo */}
        <Link to="/" className="text-lg font-semibold">
          Proyectos<span className="text-blue-400">Académicos</span>
        </Link>

        {/* Navegación pública (Home y SAPS) */}
        {isPublicRoute && (
          <div className="flex items-center gap-6 text-sm">
            <Link to="/nosotros" className="hover:underline">
              Nosotros
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setOpenSaps(true)}
              onMouseLeave={() => setOpenSaps(false)}
            >
              <button className="flex items-center gap-1 hover:underline">
                SAPS <span className="text-sm">▾</span>
              </button>
              <div
                className={`absolute top-full left-0 mt-2 w-64 bg-white text-black rounded-lg shadow-lg z-20 transition-opacity ${openSaps ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                  }`}
              >
                <ul className="flex flex-col">
                  {sapsItems.map(item => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        )}

        {/* Área de sesión */}
        {isLogged() ? (
          <div className="flex items-center gap-6 text-sm">
            <span>{user.name}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          isPublicRoute && (
            <Link
              to="/login"
              className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              Iniciar sesión
            </Link>
          )
        )}
      </div>
    </header>
  );
}
