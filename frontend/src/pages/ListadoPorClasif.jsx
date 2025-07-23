// src/pages/ListadoPorClasif.jsx
import { useEffect, useState } from "react";
import { useParams, Link }     from "react-router-dom";
import api                      from "../api/axios";

export default function ListadoPorClasif() {
  const { slug } = useParams();               // p.ej. "trabajo-competitividad"
  const [proyectos, setProyectos] = useState([]);  // ← estado y setter

  useEffect(() => {
    if (!slug) return;
    api
      .get(`/saps/${slug}/proyectos`)
      .then(r => setProyectos(r.data))         // ← aquí ya existe setProyectos
      .catch(console.error);
  }, [slug]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold capitalize">
        {slug.replace(/-/g, " ")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proyectos.map(p => (
          <Link
            key={p.id}
            to={`/proyecto/${p.id}`}
            className="flex items-center border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={`${import.meta.env.VITE_API_URL}${p.profesor_foto}`}
              alt={p.profesor_nombre}
              className="w-16 h-16 object-cover"
            />
            <div className="flex-1 px-4 py-2">
              <h3 className="font-semibold">{p.titulo}</h3>
              <p className="text-sm text-gray-600">
                Prof. {p.profesor_nombre}
              </p>
            </div>
            <span
              className={`px-3 py-1 m-2 text-xs rounded-full ${
                p.estado === "activo"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100   text-red-800"
              }`}
            >
              {p.estado}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
