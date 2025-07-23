import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Select from "react-select";
import { useDropzone } from "react-dropzone";

export default function NuevoProyecto() {
  const [clasifs, setClasifs] = useState([]);
  const [archivos, setArchivos] = useState([]);
  const { register, handleSubmit, control } = useForm();
  const nav = useNavigate();

  useEffect(() => {
    api.get("/clasificaciones")
      .then(resp => setClasifs(resp.data))
      .catch(console.error);
  }, []);

  const opcionesClasifs = clasifs.map(c => ({
    value: c.id,
    label: c.titulo
  }));

  const onDrop = (acceptedFiles) => {
    setArchivos(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': []
    },
    multiple: true,
    onDrop
  });

  const onSubmit = async data => {
    try {
      // 1. Crear proyecto
      const res = await api.post("/profesor/proyectos", data);
      const proyectoId = res.data.id;

      // 2. Subir imágenes si hay
      if (archivos.length > 0) {
        const formData = new FormData();
        archivos.forEach((file) => {
          formData.append("imagenes[]", file);
        });
        await api.post(`/profesor/proyectos/${proyectoId}/imagenes`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
      }

      nav("/prof");
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow"
      >
        <button
          onClick={() => nav("/prof")}
          aria-label="Volver"
          type="button"
          className="mb-4 p-2 rounded-full hover:bg-gray-200 transition"
        >
          <span className="text-xl text-gray-600">←</span>
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Nuevo Proyecto</h2>

        <div className="mb-3">
          <label className="block mb-1 font-medium text-gray-700">Título</label>
          <input {...register("titulo", { required: true })} className="w-full px-3 py-2 border rounded bg-white" />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium text-gray-700">Descripción</label>
          <textarea {...register("descripcion", { required: true })} className="w-full px-3 py-2 border rounded bg-white" rows={2} />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium text-gray-700">Objetivo</label>
          <textarea {...register("objetivo", { required: true })} className="w-full px-3 py-2 border rounded bg-white" rows={2} />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium text-gray-700">Tecnologías</label>
          <input {...register("tecnologias", { required: true })} className="w-full px-3 py-2 border rounded bg-white" />
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
                value={opcionesClasifs.find(o => o.value === field.value)}
                styles={{
                  control: base => ({ ...base, backgroundColor: "#fff" }),
                  option: base => ({ ...base, color: "#000" }),
                  singleValue: base => ({ ...base, color: "#000" }),
                }}
              />
            )}
          />
        </div>

        {/* DROPZONE para imágenes */}
        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700">Imágenes</label>
          <div {...getRootProps()} className="border-dashed border-2 border-gray-400 p-4 text-center rounded bg-gray-50 cursor-pointer">
            <input {...getInputProps()} />
            <p className="text-gray-600">Arrastra y suelta o haz clic para seleccionar imágenes</p>
            {archivos.length > 0 && (
              <ul className="mt-2 text-sm text-gray-700 list-disc list-inside">
                {archivos.map((file, i) => (
                  <li key={i}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Guardar Proyecto
        </button>
      </form>
    </div>
  );
}
