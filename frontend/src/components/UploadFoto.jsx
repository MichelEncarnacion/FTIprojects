import { useRef, useState } from "react";
import api from "../api/axios";

export default function UploadFoto({ onDone }) {
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef();

  // Función que sube el archivo
  const uploadFile = async (file) => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const r = await api.post("/profesor/perfil/foto", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onDone(r.data.url);
    } catch (error) {
      console.error(error);
      // Opcional: mostrar feedback de error al usuario
    } finally {
      setLoading(false);
      setIsDragging(false);
    }
  };

  // Handlers de drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
    e.dataTransfer.clearData();
  };
  const handleDragOver = (e) => e.preventDefault();
  const handleDragEnter = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };

  // Handler de selección clásica
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div className="px-4 py-2">
      <div
        className={`w-full h-40 flex items-center justify-center text-center
          border-2 border-dashed rounded-lg cursor-pointer transition-all
          ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-500'}
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => fileInputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {loading ? (
          <span className="text-gray-500">Subiendo...</span>
        ) : (
          <span className="text-gray-600">
            Arrastra y suelta tu foto aquí<br />
            o haz clic para seleccionar
          </span>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
