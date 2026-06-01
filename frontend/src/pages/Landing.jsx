import { Link } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import FeaturesGrid from '../components/FeaturesGrid.jsx';

// Imagen del hero. Cuando subas la tuya a src/assets, cámbiala por:
//   import heroImg from '../assets/TU_IMAGEN.jpg';  y usa  src={heroImg}
const HERO_IMG =
  'https://images.unsplash.com/photo-1623227907069-5ffe948a50a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920';

export default function Landing() {
  return (
    <div>
      {/* Hero con imagen de fondo + overlay morado */}
      <section className="relative overflow-hidden">
        <img src={HERO_IMG} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-rio-950/85 via-rio-900/80 to-rio-800/75" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 text-center text-white">
          <div className="mb-6 flex justify-center">
            <Logo size={88} withText={false} />
          </div>
          <h1 className="text-4xl font-extrabold drop-shadow sm:text-5xl">
            Vive el río Magdalena como nunca antes
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            Muelle Digital conecta a turistas con pescadores y guías locales de Barrancabermeja.
            Experiencias ecoturísticas seguras, organizadas y verificadas.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/experiencias" className="btn bg-white px-6 py-3 font-semibold text-rio-700 hover:bg-rio-50">
              Explorar experiencias
            </Link>
            <Link to="/registro" className="btn border border-white px-6 py-3 font-semibold text-white hover:bg-white/10">
              Crear cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Beneficios — grid de experiencias */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-slate-800 dark:text-white">
          ¿Por qué Muelle Digital?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-slate-500 dark:text-slate-400">
          Todo lo que necesitas para vivir el ecoturismo fluvial con confianza.
        </p>
        <div className="mt-10">
          <FeaturesGrid />
        </div>
      </section>

      {/* CTA guías */}
      <section className="bg-rio-50 dark:bg-rio-900/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-12 sm:flex-row">
          <div>
            <h3 className="text-xl font-bold text-rio-800 dark:text-rio-200">¿Eres guía o pescador?</h3>
            <p className="text-slate-600 dark:text-slate-400">Publica tus recorridos y recibe reservas en línea.</p>
          </div>
          <Link to="/registro" className="btn-primary px-6 py-3">
            Ofrecer mis experiencias
          </Link>
        </div>
      </section>
    </div>
  );
}
