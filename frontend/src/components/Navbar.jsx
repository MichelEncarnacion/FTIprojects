import { Link, useNavigate, useLocation } from "react-router-dom";
import { isLogged, getUser, logout } from "../auth/auth";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();
  const user = getUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSaps, setOpenSaps] = useState(false);

  const isPublicRoute =
    location.pathname === "/" || location.pathname.startsWith("/saps");

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
    <header className="bg-gradient-to-r from-blue-900 via-slate-800 to-blue-900 text-white w-full shadow-xl sticky top-0 z-50 border-b border-blue-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-tight hover:scale-105 transition-transform">
          Proyectos<span className="text-blue-400">Académicos</span>
        </Link>

        {/* Botón móvil */}
        <div className="lg:hidden">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white">
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Menú Desktop */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
          {isPublicRoute && (
            <>
              <Link to="/nosotros" className="hover:text-blue-300 hover:underline underline-offset-4 transition-all duration-150">
                Nosotros
              </Link>

              <div className="relative group">
                <span className="flex items-center gap-1 hover:text-blue-300 cursor-pointer transition-colors">
                  SAPS <span className="text-sm">▾</span>
                </span>
                <div className="absolute left-0 top-full mt-2 w-64 bg-white text-black rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-30 border border-blue-200">
                  <ul className="flex flex-col divide-y divide-gray-200">
                    {sapsItems.map(item => (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}

          <div className="h-6 w-px bg-blue-400 mx-2" />

          {isLogged() ? (
            <>
              <span className="font-semibold text-sm tracking-wide">{user.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-full shadow-sm transition"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            isPublicRoute && (
              <Link
                to="/login"
                className="px-4 py-1 bg-blue-500 rounded-full hover:bg-blue-600 transition text-white"
              >
                Iniciar sesión
              </Link>
            )
          )}
        </nav>
      </div>

      {/* Menú Móvil mejorado */}
      {mobileOpen && (
        <div className="lg:hidden bg-slate-900 text-white px-6 py-6 space-y-6 border-t border-slate-700 shadow-2xl">
          {/* Sección: Navegación pública */}
          {isPublicRoute && (
            <>
              <div className="space-y-3">
                <h3 className="text-blue-300 font-semibold text-xs uppercase tracking-wider">
                  Navegación
                </h3>
                <Link to="/nosotros" className="block hover:text-blue-400 text-base">
                  Nosotros
                </Link>

                {/* SAPS */}
                <div className="pt-3 border-t border-slate-600">
                  <div
                    onClick={() => setOpenSaps(!openSaps)}
                    className="flex justify-between items-center cursor-pointer hover:text-blue-400 transition"
                  >
                    <span className="text-base">SAPS</span>
                    <span>{openSaps ? "▲" : "▼"}</span>
                  </div>
                  {openSaps && (
                    <ul className="mt-3 space-y-2 ml-2 border-l border-blue-500 pl-4">
                      {sapsItems.map(item => (
                        <li key={item.to}>
                          <Link
                            to={item.to}
                            className="block hover:text-blue-300"
                            onClick={() => setMobileOpen(false)}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Sección: Sesión */}
          <div className="pt-6 border-t border-slate-700 space-y-3">
            <h3 className="text-blue-300 font-semibold text-xs uppercase tracking-wider">
              Cuenta
            </h3>

            {isLogged() ? (
              <>
                <span className="block font-medium">{user.name}</span>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              isPublicRoute && (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center bg-blue-600 py-2 rounded hover:bg-blue-700 transition"
                >
                  Iniciar sesión
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}
