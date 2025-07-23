// src/pages/prof/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { logout, getUser } from "../../auth/auth";
import UploadFoto from "../../components/UploadFoto.jsx";

export default function Dashboard() {
  const [prof, setProf] = useState(null);
  const [proyectos, setProyectos] = useState([]);
  const nav = useNavigate();
  const base = import.meta.env.VITE_API_URL;

  useEffect(() => {
    api.get("/profesor/perfil").then(r => setProf(r.data));
    api.get("/profesor/proyectos").then(r => setProyectos(r.data));
  }, []);

  async function toggleEstado(id) {
    try {
      const r = await api.put(`/profesor/proyectos/${id}/estado`);
      setProyectos(ps =>
        ps.map(p => (p.id === id ? { ...p, estado: r.data.estado } : p))
      );
    } catch (e) {
      console.error(e);
    }
  }

  function handleLogout() {
    logout();
    nav("/login");
  }

  if (!prof) return <div className="p-6">Cargando…</div>;

  return (
    <div className="p-6 w-full space-y-10">
      {/* PERFIL */}
      <section className="bg-white p-6 rounded-lg shadow flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <img
            src={`${base}${prof.foto_url}?t=${Date.now()}`}
            alt={prof.nombre}
            className="w-24 h-24 rounded-full object-cover shadow"
          />
          <div className="leading-tight">
            <h1 className="text-2xl font-bold">{prof.nombre}</h1>
            <p className="text-gray-600">{getUser().email}</p><br />

            <div className="space-y-4 text-sm">
              <div>
                <h2 className="font-semibold">Formación académica</h2>
                <p className="text-gray-700">{prof.formacion_lic}</p>
              </div>
              <div>
                <h2 className="font-semibold">Licenciatura en Maestría</h2>
                <p className="text-gray-700">{prof.formacion_mtr}</p>
              </div>
              <div>
                <h2 className="font-semibold">Licenciatura en Doctorado</h2>
                <p className="text-gray-700">{prof.formacion_doc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACTUALIZAR FOTO */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Actualizar foto de perfil</h2>
        <UploadFoto
          className="px-4 py-2 bg-gray-200 text-white-800 rounded-md hover:bg-gray-300 transition"
          onDone={url => setProf(p => ({ ...p, foto_url: url }))}
        />
      </section>

      {/* MIS PROYECTOS */}
      <section>
        <h2 className="text-xl font-bold mb-4">Mis proyectos</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => nav("/prof/proyectos/nuevo")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            + Nuevo Proyecto
          </button>
        </div><br />
        <div className="space-y-6">
          {proyectos.map(p => (
            <article
              key={p.id}
              className="border rounded-lg shadow-sm overflow-hidden"
            >
              {/* Banner */}
              <div className="bg-gray-100 px-4 py-3 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{p.titulo}</h3>
                  <p className="text-sm text-gray-700">{p.objetivo}</p>
                  <p className="text-sm text-gray-500">{p.tecnologias}</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleEstado(p.id)}
                    className="relative inline-flex items-center h-6 w-12 rounded-full p-1 transition-colors duration-200"
                    style={{
                      backgroundColor:
                        p.estado === "activo" ? "#16A34A" : "#DC2626"
                    }}
                  >
                    <span
                      className="inline-block w-4 h-4 bg-white rounded-full transform transition-transform duration-200"
                      style={{
                        transform:
                          p.estado === "activo"
                            ? "translateX(1.5rem)"
                            : "translateX(0)"
                      }}
                    />
                  </button>
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      p.estado === "activo"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {p.estado}
                  </span>
                </div>
              </div>

              {/* Cuerpo */}
              <div className="px-4 py-3">
                <p className="text-gray-700">{p.descripcion}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => nav(`/prof/proyectos/${p.id}/editar`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm("¿Eliminar este proyecto?")) {
                        await api.delete(`/profesor/proyectos/${p.id}`);
                        setProyectos(ps => ps.filter(x => x.id !== p.id));
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </article>
          ))}
          {proyectos.length === 0 && (
            <p className="text-gray-500">Sin proyectos creados aún.</p>
          )}
        </div>
      </section>
    </div>
  );
}
