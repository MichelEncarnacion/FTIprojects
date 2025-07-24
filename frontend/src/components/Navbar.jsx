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
    <header className="bg-slate-800 text-white w-full shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight">
          Proyectos<span className="text-blue-400">Académicos</span>
        </Link>

        {/* Botón móvil */}
        <div className="lg:hidden">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white">
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Menú Desktop */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm">
          {isPublicRoute && (
            <>
              <Link to="/nosotros" className="hover:text-blue-300 transition-colors">
                Nosotros
              </Link>

              {/* SAPS Dropdown */}
              <div className="relative group">
                <span className="flex items-center gap-1 hover:text-blue-300 transition-colors cursor-pointer">
                  SAPS <span className="text-sm">▾</span>
                </span>
                <div className="absolute left-0 top-full mt-2 w-64 bg-white text-black rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-30 border border-slate-200">
                  <ul className="flex flex-col divide-y">
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
            </>
          )}

          {/* Sesión */}
          {isLogged() ? (
            <>
              <span className="font-medium">{user.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 transition-colors"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            isPublicRoute && (
              <Link
                to="/login"
                className="px-3 py-1 hover:text-blue-300 transition-colors"
              >
                Iniciar sesión
              </Link>
            )
          )}
        </nav>
      </div>

      {/* Menú Móvil */}
      {mobileOpen && (
        <div className="lg:hidden bg-slate-700 px-4 pb-4 text-sm space-y-3">
          {isPublicRoute && (
            <>
              <Link to="/nosotros" className="block hover:text-blue-300">
                Nosotros
              </Link>

              {/* SAPS Dropdown en Mobile */}
              <div className="border-t border-slate-600 pt-2">
                <div
                  onClick={() => setOpenSaps(!openSaps)}
                  className="flex items-center justify-between w-full text-white hover:text-blue-300 cursor-pointer transition-colors"
                >
                  <span>SAPS</span>
                  <span>{openSaps ? "▲" : "▼"}</span>
                </div>
                {openSaps && (
                  <ul className="mt-2 space-y-2 pl-4">
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
            </>
          )}

          {/* Sesión */}
          {isLogged() ? (
            <>
              <div className="border-t border-slate-600 pt-2">
                <span className="block font-medium">{user.name}</span>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="mt-1 px-3 py-1 bg-red-600 rounded hover:bg-red-700 transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            </>
          ) : (
            isPublicRoute && (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block mt-2 px-3 py-1"
              >
                Iniciar sesión
              </Link>
            )
          )}
        </div>
      )}
    </header>
  );
}
