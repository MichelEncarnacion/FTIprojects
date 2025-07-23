import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import {
  getUsuarios,
  crearUsuario,
  eliminarUsuario,
  actualizarUsuario,
  getUsuarioById,
} from '../../services/usuarios';

export default function UsuariosDashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    nombre: '', email: '', password: '', role_id: 2,
    formacion_lic: '', formacion_mtr: '', formacion_doc: ''
  });
  const [editId, setEditId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (err) {
      setError('Error al cargar usuarios');
    }
  };

  const limpiarForm = () => {
    setForm({
      nombre: '', email: '', password: '', role_id: 2,
      formacion_lic: '', formacion_mtr: '', formacion_doc: ''
    });
    setEditId(null);
  };

  const handleGuardarUsuario = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await actualizarUsuario(editId, form);
        setMensaje('Usuario actualizado correctamente');
      } else {
        await crearUsuario(form);
        setMensaje('Usuario creado correctamente');
      }
      setModalOpen(false);
      limpiarForm();
      cargarUsuarios();
    } catch {
      setError('Error al guardar usuario');
    }
  };

  const handleEdit = async (id) => {
    try {
      const usuario = await getUsuarioById(id);
      setForm({ ...usuario, password: '' }); // ocultamos la contraseña
      setEditId(id);
      setModalOpen(true);
      setError('');
      setMensaje('');
    } catch {
      setError('Error al cargar usuario');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que deseas eliminarlo?')) return;
    try {
      await eliminarUsuario(id);
      setMensaje('Usuario eliminado correctamente');
      cargarUsuarios();
    } catch {
      setError('Error al eliminar usuario');
    }
  };

  return (
    <div className="flex w-screen min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 px-6 py-8 bg-gray-50">
        <div className="flex justify-between items-center mb-6"><br />
          <h1 className="text-3xl font-bold">Usuarios</h1>
          <button
            onClick={() => {
              limpiarForm();
              setModalOpen(true);
              setError('');
              setMensaje('');
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
          >
            Nuevo usuario
          </button>
        </div>

        {mensaje && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">
            {mensaje}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow rounded overflow-hidden">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Rol</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-2">{u.nombre}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.rol}</td>
                  
                 <td className="px-4 py-2">
  <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
    <button
      onClick={() => handleEdit(u.id)}
      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
    >
      Editar
    </button>
    <button
      onClick={() => handleDelete(u.id)}
      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
    >
      Eliminar
    </button>
  </div>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {modalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
            onClick={() => setModalOpen(false)}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">
                {editId ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h2>

              {error && (
                <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300">
                  {error}
                </div>
              )}

              <form onSubmit={handleGuardarUsuario} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="p-2 border rounded"
                  placeholder="Nombre"
                  value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })}
                  required
                />
                <input
                  className="p-2 border rounded"
                  placeholder="Email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
                {!editId && (
                  <input
                    className="p-2 border rounded"
                    placeholder="Password"
                    type="password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required
                  />
                )}
                <select
                  className="p-2 border rounded"
                  value={form.role_id}
                  onChange={e => setForm({ ...form, role_id: parseInt(e.target.value) })}
                >
                  <option value={1}>Admin</option>
                  <option value={2}>Profesor</option>
                </select>
                <input
                  className="p-2 border rounded col-span-full"
                  placeholder="Formación Licenciatura"
                  value={form.formacion_lic}
                  onChange={e => setForm({ ...form, formacion_lic: e.target.value })}
                />
                <input
                  className="p-2 border rounded col-span-full"
                  placeholder="Formación Maestría"
                  value={form.formacion_mtr}
                  onChange={e => setForm({ ...form, formacion_mtr: e.target.value })}
                />
                <input
                  className="p-2 border rounded col-span-full"
                  placeholder="Formación Doctorado"
                  value={form.formacion_doc}
                  onChange={e => setForm({ ...form, formacion_doc: e.target.value })}
                />

                <div className="col-span-full flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {editId ? 'Actualizar' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
