import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AuthLayout from '../components/AuthLayout.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', telefono: '' });
  const [intencion, setIntencion] = useState('turista'); // turista | guia
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      // El guía debe pasar por el formulario de verificación; el turista entra directo.
      navigate(intencion === 'guia' ? '/solicitud-guia' : '/experiencias');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const Opcion = ({ val, titulo, desc }) => (
    <button
      type="button"
      onClick={() => setIntencion(val)}
      className={`flex-1 rounded-xl border p-4 text-left transition ${
        intencion === val
          ? 'border-rio-500 bg-rio-50 ring-2 ring-rio-200 dark:bg-rio-800/50 dark:ring-rio-700'
          : 'border-slate-200 hover:border-rio-300 dark:border-rio-800 dark:hover:border-rio-600'
      }`}
    >
      <p className="font-semibold text-slate-800 dark:text-white">{titulo}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{desc}</p>
    </button>
  );

  return (
    <AuthLayout title="Crear cuenta" subtitle="Únete a la comunidad fluvial de Barrancabermeja.">
      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="mb-5 flex gap-3">
        <Opcion val="turista" titulo="Soy turista" desc="Quiero reservar experiencias" />
        <Opcion val="guia" titulo="Soy guía / pescador" desc="Quiero ofrecer experiencias" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Nombre completo</label>
          <input required className="input" value={form.nombre} onChange={set('nombre')} />
        </div>
        <div>
          <label className="label">Correo electrónico</label>
          <input type="email" required className="input" value={form.email} onChange={set('email')} />
        </div>
        <div>
          <label className="label">Teléfono (opcional)</label>
          <input className="input" value={form.telefono} onChange={set('telefono')} />
        </div>
        <div>
          <label className="label">Contraseña</label>
          <input type="password" required className="input" placeholder="Mínimo 6 caracteres" value={form.password} onChange={set('password')} />
        </div>

        {intencion === 'guia' && (
          <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
            🔐 Como guía, después de crear tu cuenta llenarás un formulario de verificación.
            Un administrador lo revisará antes de habilitarte para publicar experiencias.
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
          {loading ? 'Creando…' : 'Crear cuenta'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-semibold text-rio-700 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  );
}
