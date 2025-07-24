import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import bgImage from '../assets/login-bg.jpg';

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();
  const navigate = useNavigate();

  async function onSubmit(data) {
    try {
      const r = await api.post('/auth/login', {
        email: data.email,
        password: data.password
      });
      localStorage.setItem('token', r.data.token);
      localStorage.setItem('user', JSON.stringify(r.data.user));
      Number(r.data.user.role) === 1 ? navigate('/admin') : navigate('/prof');
    } catch {
      alert('Credenciales incorrectas');
    }
  }

  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/60 border border-white/30 dark:border-gray-700 p-10 rounded-3xl shadow-2xl max-w-md w-full transition-all">
        <h2 className="text-4xl font-bold text-white text-center mb-3">
          ¡Bienvenido!
        </h2>
        <p className="text-white/80 text-center mb-8">
          Ingresa tus credenciales para continuar
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              type="email"
              {...register('email', { required: true })}
              placeholder="Correo electrónico"
              className="w-full px-5 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 placeholder-gray-500 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />
            {errors.email && (
              <p className="text-red-300 text-sm mt-1">El email es obligatorio</p>
            )}
          </div>

          <div>
            <input
              type="password"
              {...register('password', { required: true })}
              placeholder="Contraseña"
              className="w-full px-5 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 placeholder-gray-500 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />
            {errors.password && (
              <p className="text-red-300 text-sm mt-1">La contraseña es obligatoria</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl text-white font-semibold bg-red-600 hover:bg-red-700 shadow-md hover:shadow-xl transition-all duration-200 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
