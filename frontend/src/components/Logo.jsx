import logo from '../assets/logomuelle.png';

// Logo oficial de Muelle Digital.
// Se envuelve en un círculo blanco (contorno) para que el ancla oscura
// del logo sea visible también sobre fondos oscuros (índigo del header/auth).
export default function Logo({ size = 40, withText = true, textClass = '' }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="inline-flex shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5"
        style={{ width: size, height: size, padding: Math.round(size * 0.1) }}
      >
        <img src={logo} alt="Muelle Digital" className="h-full w-full rounded-full object-contain" />
      </span>
      {withText && <span className={`font-extrabold tracking-tight ${textClass}`}>Muelle Digital</span>}
    </span>
  );
}
