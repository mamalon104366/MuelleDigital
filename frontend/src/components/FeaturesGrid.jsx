import { Search, ShieldCheck, Calendar, CreditCard } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback.jsx';

const items = [
  {
    id: 1,
    icon: Search,
    title: 'Encuentra experiencias',
    description: 'Recorridos fluviales, avistamiento de fauna y pesca artesanal en un solo lugar.',
    image:
      'https://images.unsplash.com/photo-1742648601638-c3062e720d29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: 'Guías verificados',
    description: 'Reseñas y calificaciones reales de otros viajeros.',
    image:
      'https://images.unsplash.com/photo-1650201776897-3ab1ac29c33a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 3,
    icon: Calendar,
    title: 'Reserva fácil',
    description: 'Elige fecha, asegura tu cupo y recibe confirmación al instante.',
    image:
      'https://images.unsplash.com/photo-1623227907069-5ffe948a50a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 4,
    icon: CreditCard,
    title: 'Pago seguro',
    description: 'Paga con tarjeta (Stripe), Nequi o Daviplata de forma rápida y segura.',
    image:
      'https://images.unsplash.com/photo-1709640723206-35fbe8615746?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
];

// Grid responsivo de experiencias: 1 col (móvil) · 2x2 (md) · 4 col (xl).
export default function FeaturesGrid() {
  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-black/5 dark:ring-white/10">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div
              key={it.id}
              className="group relative aspect-[4/3] overflow-hidden md:aspect-square xl:aspect-[4/3]"
            >
              <ImageWithFallback
                src={it.image}
                alt={it.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <Icon className="mb-3 h-9 w-9 text-white transition-transform duration-300 group-hover:scale-110 md:h-11 md:w-11" />
                <h3 className="text-lg font-bold text-white md:text-2xl">{it.title}</h3>
                <p className="mt-1 max-w-xs text-sm leading-relaxed text-white/80 md:text-base">
                  {it.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
