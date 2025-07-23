// src/pages/SapsTrabajoCompetitividad.jsx
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function SapsVidaSalud() {
    const [proyectos, setProyectos] = useState([]);
    const nav = useNavigate();
    const base = import.meta.env.VITE_API_URL;


    useEffect(() => {
        api.get('/saps/vida-salud/proyectos')
            .then(r => setProyectos(r.data))
            .catch(console.error);
    }, []);

    return (
        <div className="min-h-screen p-6 bg-gray-50 space-y-10">
            {/* Cabecera */}
            <section className="flex flex-col md:flex-row items-center bg-orange-100 rounded-lg overflow-hidden">
                <div className="bg-orange-500 p-8 flex-shrink-0 rounded-full">
                    {/* Aquí tu icono */}
                    <img src="/assets/tierra.png" alt="Icono SAPS" className="w-12 h-12 text-white" />

                </div>
                <div className="p-6 flex-1">
                    <h1 className="text-2xl font-bold mb-2">Vida y Salud</h1>
                    <p className="text-gray-700">Vida y Salud

                        Programa que fusiona salud integral, sustentabilidad y cultura de la vida para impulsar bienestar físico-mental, equilibrio ambiental y respeto absoluto a la dignidad humana en todas sus etapas.</p>
                </div>
                <div className=" grid grid-cols-1 gap-4">
                    <img src="/assets/vidasSalud.jpg" alt="Vida y Salud" className="rounded-lg shadow-lg object-cover h-48 w-full" />
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