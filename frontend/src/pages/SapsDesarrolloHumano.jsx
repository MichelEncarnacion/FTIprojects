// src/pages/SapsTrabajoCompetitividad.jsx
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function SapsDesarrolloHumano() {
   const [proyectos, setProyectos] = useState([]);
    const nav = useNavigate();
    const base = import.meta.env.VITE_API_URL;

     useEffect(() => {
api.get('/saps/desarrollo-humano/proyectos')
       .then(r => setProyectos(r.data))
       .catch(console.error);
  }, []);

    return (
        <div className="min-h-screen p-6 bg-gray-50 space-y-10">
            {/* Cabecera */}
            <section className="flex flex-col md:flex-row items-center bg-blue-300 rounded-lg overflow-hidden">
                <div className="bg-blue-600 p-8 flex-shrink-0 rounded-full">
                    {/* Aquí tu icono */}
                    <img src="/assets/naturaleza.png" alt="Icono SAPS" className="w-12 h-12 text-white" />

                </div>
                <div className="p-6 flex-1">
                    <h1 className="text-2xl font-bold mb-2">Desarrollo Humano y Social</h1>
                    <p className="text-gray-700">
                        Sistema que eleva la calidad de vida fortaleciendo capacidades humanas y comunitarias con base en dignidad y bien común, a través de tres frentes: preservación del patrimonio cultural, creatividad para transformar lo social y fortalecimiento de la familia y la educación.</p>
                </div>
                <div className=" grid grid-cols-1 gap-4">
                    <img src="/assets/DesaHuma.png" alt="Nosotros 1" className="rounded-lg shadow-lg object-cover h-48 w-full" />
                </div>

            </section>

            {/* Tabla de Proyectos */}
            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {proyectos.map(p => (
                    <div
                        key={p.id}
                        onClick={() => nav(`/proyecto/${p.id}`)}
                        className="cursor-pointer bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center mb-3">
                            <img
                                src={base + p.profesor_foto}
                                alt={p.profesor_nombre}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <span className="ml-3 font-semibold">{p.profesor_nombre}</span>
                        </div>
                        <h3 className="text-lg font-bold">{p.titulo}</h3>
                        <span
                            className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${p.estado === 'activo'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                        >
                            {p.estado}
                        </span>
                    </div>
                ))}
                {proyectos.length === 0 && (
                    <p className="text-center text-gray-500 col-span-full">
                        No hay proyectos disponibles.
                    </p>
                )}
            </section>
        </div>
    );
}