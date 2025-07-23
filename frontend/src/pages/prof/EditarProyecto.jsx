// src/pages/prof/EditarProyecto.jsx
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Select from "react-select";
import Dropzone from "react-dropzone";

export default function EditarProyecto() {
  const { id } = useParams();
  const nav = useNavigate();

  const [clasifs, setClasifs] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [archivos, setArchivos] = useState([]);

  const { register, handleSubmit, reset, control } = useForm();

  useEffect(() => {
    async function loadData() {
      try {
        const cResp = await api.get("/clasificaciones");
        setClasifs(cResp.data);

        const pResp = await api.get(`/profesor/proyectos/${id}`);
        const proj = pResp.data;
        proj.clasif_id = proj.clasif_id ?? proj.clasificacion_id ?? null;
        reset(proj);

        const imgResp = await api.get(`/profesor/proyectos/${id}/imagenes`);
        setImagenes(imgResp.data);
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, [id, reset]);

  const opcionesClasifs = clasifs.map(c => ({ value: c.id, label: c.titulo }));

  const onSubmit = async data => {
    try {
      await api.put(`/profesor/proyectos/${id}`, data);

      if (archivos.length > 0) {
        const formData = new FormData();
        archivos.forEach(f => formData.append("imagenes[]", f));
        await api.post(`/profesor/proyectos/${id}/imagenes`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      nav("/prof");
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteImage = async (imgId) => {
    if (!confirm("¿Eliminar imagen?")) return;
    try {
      await api.delete(`/profesor/imagenes/${imgId}`);
      setImagenes(prev => prev.filter(img => img.id !== imgId));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl bg-white p-6 rounded-lg shadow"
      >
        <button
          onClick={() => nav("/prof")}
          aria-label="Volver"
          className="mb-4 p-2 rounded-full hover:bg-gray-200 transition"
        >
          <span className="text-xl text-gray-600">←</span>
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">Editar Proyecto</h2>

        <div className="mb-3">
          <label className="block mb-1 font-medium text-gray-700">Título</label>
          <input {...register("titulo", { required: true })} className="w-full px-3 py-2 border rounded bg-white text-black" />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium text-gray-700">Descripción</label>
          <textarea {...register("descripcion", { required: true })} rows={2} className="w-full px-3 py-2 border rounded bg-white text-black" />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium text-gray-700">Objetivo</label>
          <textarea {...register("objetivo", { required: true })} rows={2} className="w-full px-3 py-2 border rounded bg-white text-black" />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium text-gray-700">Tecnologías</label>
          <input {...register("tecnologias", { required: true })} className="w-full px-3 py-2 border rounded bg-white text-black" />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700">Clasificación</label>
          <Controller
            name="clasif_id"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                options={opcionesClasifs}
                placeholder="— Selecciona —"
                onChange={opt => field.onChange(opt?.value)}
                value={opcionesClasifs.find(o => o.value === field.value) || null}
              />
            )}
          />
        </div>

        {/* DROPZONE */}
        <div className="mb-4">
          <Dropzone onDrop={(accepted) => setArchivos(accepted)}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="p-4 border border-dashed rounded text-center cursor-pointer">
                <input {...getInputProps()} />
                <p className="text-gray-500">Arrastra o haz clic para subir nuevas imágenes</p>
              </div>
            )}
          </Dropzone>
          {archivos.length > 0 && (
            <ul className="mt-2 text-sm text-gray-700 list-disc list-inside">
              {archivos.map(f => <li key={f.name}>{f.name}</li>)}
            </ul>
          )}
        </div>

        {/* IMÁGENES ACTUALES */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {imagenes.map(img => (
            <div key={img.id} className="relative border rounded overflow-hidden">
              <img
                src={`http://localhost:8000/uploads/proyectos/${img.filename}`}
                alt="Imagen"
                className="w-full h-32 object-cover"
              />
              <button
                type="button" //  Evita el submit del formulario
                onClick={(e) => {
                  e.preventDefault();     //  Previene el envío
                  handleDeleteImage(img.id);
                }}
                className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 text-xs rounded"
              >
                X
              </button>
            </div>
          ))}
        </div>
        {/* Elegir imagen destacada */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Imagen destacada</label>
          <select
            {...register("imagen_destacada")}
            className="w-full border px-3 py-2 rounded"
            defaultValue=""
          >
            <option value="">— Seleccionar —</option>
            {imagenes.map(img => (
              <option key={img.id} value={img.filename}>
                {img.filename}
              </option>
            ))}
          </select>
        </div>


        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
