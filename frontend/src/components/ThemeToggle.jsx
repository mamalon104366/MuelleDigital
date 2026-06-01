import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

// Alterna modo claro/oscuro y lo persiste en localStorage.
export default function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      title={dark ? 'Modo claro' : 'Modo oscuro'}
      aria-label="Cambiar tema"
      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-rio-50 dark:text-slate-300 dark:hover:bg-rio-800"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
