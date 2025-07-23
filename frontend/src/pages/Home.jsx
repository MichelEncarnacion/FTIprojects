// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Home() {
  const [proyectos, setProyectos] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    api.get("/proyectos").then(r => setProyectos(r.data));
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/home-hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Tu plataforma de proyectos académicos
          </h1>
          <p className="max-w-2xl mb-8 text-lg">
            Descubre, comparte y gestiona proyectos de investigación y desarrollo con tu comunidad académica.
          </p>
        </div>
      </section>

      {/* Nosotros Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center px-6 gap-12">
          <div className="md:w-1/2 bg-white p-8 rounded-lg shadow">
            <h2 className="text-3xl font-bold mb-4">Nosotros</h2>
            <p className="text-gray-700 mb-4">
              La Facultad TI es el punto de encuentro entre la ciencia, <span className="font-semibold">creatividad digital</span> y el <span className="font-semibold">compromiso social</span>.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Diseñan soluciones tecnológicas con impacto real, alineadas a los ejes SAPS</li>
              <li>Fomentan la innovación en proyectos estudiantiles</li>
              <li>Impulsan la colaboración entre estudiantes y profesores</li>
            </ul>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-4">
            <img src="/assets/nosotros1.jpg" alt="Nosotros 1" className="rounded-lg shadow-lg object-cover h-48 w-full" />
            <img src="/assets/nosotros2.jpg" alt="Nosotros 2" className="rounded-lg shadow-lg object-cover h-48 w-full" />
          </div>
        </div>
      </section>

      {/* Galería Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Galería</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {proyectos.map(p => (
              <article key={p.id} className="bg-gray-100 rounded-lg overflow-hidden shadow">
                <div className="h-48 bg-gray-300 flex items-center justify-center">
                  {p.imagen_destacada ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/uploads/proyectos/${p.imagen_destacada}`}
                      alt={p.titulo}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">Sin imagen</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{p.titulo}</h3>
                  <p className="text-gray-600 text-sm">{p.tecnologias}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>




      {/* Footer (mantener como está) */}
      <footer className="bg-slate-800 text-white py-6">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm">
          © {new Date().getFullYear()} Proyectos Académicos. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
