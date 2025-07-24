import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import backArrow from "/assets/arrow-left.png";

export default function ProyectoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proyecto, setProyecto] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [modalImg, setModalImg] = useState(null);
  const base = import.meta.env.VITE_API_URL;

  useEffect(() => {
    api.get(`/proyectos/${id}`).then(r => setProyecto(r.data)).catch(console.error);
    api.get(`/public/proyectos/${id}/imagenes`).then(r => setImagenes(r.data)).catch(console.error);
  }, [id]);

  useEffect(() => {
    const handleEsc = e => e.key === "Escape" && setModalImg(null);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (!proyecto) return <div className="flex items-center justify-center h-screen">Cargando…</div>;

  const {
    titulo,
    descripcion,
    objetivo,
    tecnologias,
    profesor_nombre,
    profesor_foto_url,
    estado,
    clasif_titulo,
  } = proyecto;

  // Flechas personalizadas
  const PrevArrow = ({ onClick }) => (
    <button onClick={onClick} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white text-gray-700 p-2 rounded-full shadow hover:bg-blue-100">
      <FaArrowLeft />
    </button>
  );

  const NextArrow = ({ onClick }) => (
    <button onClick={onClick} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white text-gray-700 p-2 rounded-full shadow hover:bg-blue-100">
      <FaArrowRight />
    </button>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="flex items-center space-x-2 p-4 bg-blue-600 text-white">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-blue-500 rounded" title="Volver">
            <img src={backArrow} alt="Volver" className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold ml-2">Detalles del Proyecto</h1>
        </div>

        <div className="p-6 space-y-8">

          {/* Título y estado */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-3xl font-extrabold text-gray-800">{titulo}</h2>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${estado === "activo"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
              }`}>
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </span>
          </div>

          {/* Profesor */}
          <div className="flex items-center gap-4">
            <img
              src={`${base}${profesor_foto_url}`}
              alt={profesor_nombre}
              className="w-20 h-20 rounded-full object-cover shadow"
            />
            <p className="text-lg font-medium text-gray-700">{profesor_nombre}</p>
          </div>

          {/* Galería de imágenes */}
          {imagenes.length === 1 && (
            <div className="w-full">
              <img
                src={`${base}/uploads/proyectos/${imagenes[0].filename}`}
                alt="Imagen única"
                onClick={() => setModalImg(`${base}/uploads/proyectos/${imagenes[0].filename}`)}
                className="cursor-pointer rounded-lg shadow object-cover h-64 w-full"
              />
            </div>
          )}

          {imagenes.length > 1 && (
            <div className="relative">
              <Slider {...settings}>
                {imagenes.map((img, i) => (
                  <div key={img.id}>
                    <img
                      src={`${base}/uploads/proyectos/${img.filename}`}
                      alt={`Imagen ${i + 1}`}
                      onClick={() => setModalImg(`${base}/uploads/proyectos/${img.filename}`)}
                      className="cursor-pointer rounded-lg object-cover h-64 w-full"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          )}

          {/* Modal de imagen */}
          {modalImg && (
            <div
              onClick={() => setModalImg(null)}
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            >
              <img src={modalImg} alt="Vista ampliada" className="max-w-full max-h-full rounded-lg shadow-lg" />
            </div>
          )}

          {/* Descripción y objetivo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">Problema que resuelve</h3>
              <p className="text-gray-600">{descripcion}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">Objetivo</h3>
              <p className="text-gray-600">{objetivo}</p>
            </div>
          </div>

          {/* Clasificación y tecnologías */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">Clasificación</h3>
              <p className="text-gray-600">{clasif_titulo}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">Tecnologías</h3>
              <div className="flex flex-wrap gap-2">
                {tecnologias.split(",").map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
