import api from '../api/axios';

export async function getUsuarios() {
  const res = await api.get('/admin/usuarios');
  return res.data;
}

export async function crearUsuario(data) {
  const res = await api.post('/admin/usuarios', data);
  return res.data;
}

export async function eliminarUsuario(id) {
  return api.delete(`/admin/usuarios/${id}`);
}

export async function actualizarUsuario(id, data) {
  return api.put(`/admin/usuarios/${id}`, data);
}

export async function getUsuarioById(id) {
  const res = await api.get(`/admin/usuarios/${id}`);
  return res.data;
}
