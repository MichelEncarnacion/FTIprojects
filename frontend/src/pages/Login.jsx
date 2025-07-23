// frontend/src/pages/Login.jsx
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
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
 style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="backdrop-blur-md bg-white/20 dark:bg-gray-900/40 border-2 border-red-500 p-8 rounded-2xl shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-extrabold text-black mb-6 text-center">
          Bienvenido
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <input
              type="email"
              {...register('email', { required: true })}
              placeholder="Tu email"
              className={`
                w-full px-4 py-3 rounded-lg
                bg-white bg-opacity-90 placeholder-red-400
                focus:outline-none focus:ring-2 focus:ring-red-300
                transition
              `}
            />
            {errors.email && (
              <p className="mt-1 text-red-200 text-sm">El email es obligatorio</p>
            )}
          </div>

          <div>
            <input
              type="password"
              {...register('password', { required: true })}
              placeholder="Contraseña"
              className={`
                w-full px-4 py-3 rounded-lg
                bg-white bg-opacity-90 placeholder-red-400
                focus:outline-none focus:ring-2 focus:ring-red-300
                transition
              `}
            />
            {errors.password && (
              <p className="mt-1 text-black text-sm">La contraseña es obligatoria</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full py-3 rounded-lg text-white font-semibold
              bg-red-600 hover:bg-red-700
              shadow-lg hover:shadow-2xl transition-all
              ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            {isSubmitting ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
