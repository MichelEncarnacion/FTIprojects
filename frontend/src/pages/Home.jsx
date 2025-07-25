import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Home() {
  const [proyectos, setProyectos] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    api.get("/proyectos").then(r => setProyectos(r.data));
  }, []);

  return (
    <div className="flex flex-col overflow-x-hidden w-screen">
      {/* Hero Section */}
      <section
        className="relative w-screen h-screen bg-cover bg-center"
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

      {/* Nosotros Section (una imagen) */}
      <section className="py-20 bg-white w-full border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <div className="space-y-6">
            <h2 className="text-4xl font-extrabold text-slate-800">¿Quiénes somos?</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              En la <span className="font-semibold text-slate-900">Facultad de Tecnologías de la Información y Ciencia de Datos</span>, formamos una comunidad dinámica donde convergen la innovación tecnológica, la creatividad digital y el compromiso social.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Nuestro enfoque está alineado con los ejes <span className="font-semibold">SAPS</span> (Solidaridad, Autonomía, Plenitud y Sabiduría), generando un espacio donde los estudiantes diseñan soluciones de alto impacto, fomentando el pensamiento crítico y la colaboración interdisciplinaria.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 text-base">
              <li>Proyectos tecnológicos con impacto real en la sociedad.</li>
              <li>Creatividad y trabajo colaborativo entre alumnos y docentes.</li>
              <li>Habilidades blandas y técnicas clave para el entorno profesional.</li>
            </ul>
          </div>

          {/* Imagen única */}
          <div>
            <img
              src="/assets/nosotros1.jpg"
              alt="Equipo de trabajo"
              className="rounded-xl shadow-xl object-cover w-full h-80"
            />
          </div>
        </div>
      </section>

      {/* Galería Section */}
      <section className="py-16 w-full">
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

      {/* Footer Pro */}
      <footer className="bg-slate-900 text-gray-300 pt-12 pb-6 w-full border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Branding */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-white mb-2">Proyectos Académicos</h2>
            <p className="text-sm">
              Inspirando conocimiento, creando soluciones.
            </p>
          </div>

          {/* Enlaces */}
          <div className="text-center">
            <h3 className="text-white font-semibold text-lg mb-3">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="hover:text-white transition">Sobre Nosotros</a></li>
              <li><a href="/projects" className="hover:text-white transition">Proyectos</a></li>
              <li><a href="/contact" className="hover:text-white transition">Contacto</a></li>
              <li><a href="/terms" className="hover:text-white transition">Términos y Condiciones</a></li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div className="text-center md:text-right">
            <h3 className="text-white font-semibold text-lg mb-3">Síguenos</h3>
            <div className="flex justify-center md:justify-end gap-4 text-xl">
              <a href="#" className="hover:text-white transition"><FaFacebookF /></a>
              <a href="#" className="hover:text-white transition"><FaTwitter /></a>
              <a href="#" className="hover:text-white transition"><FaInstagram /></a>
              <a href="#" className="hover:text-white transition"><FaLinkedin /></a>
            </div>
          </div>
        </div>

        {/* Línea final */}
        <div className="mt-10 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Proyectos Académicos. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
