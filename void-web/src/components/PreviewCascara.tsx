'use client';

import { useEffect, useState } from 'react';

const CLAVE = 'void:cascara';

/**
 * Interruptor temporal para comparar las dos cáscaras candidatas sobre pantallas
 * reales en vez de sobre muestras de color.
 *
 *   Grafito  →  la definitiva (era la opción B)
 *   Piedra   →  la alterna en evaluación (era la opción C)
 *
 * Cuando se decida, borra este componente, su uso en el layout y el bloque
 * [data-cascara='piedra'] de tokens.css.
 */
export default function PreviewCascara() {
  const [cascara, setCascara] = useState<'grafito' | 'piedra'>('grafito');

  // La elección se lee después de montar, no durante el render: el HTML del
  // servidor no conoce el localStorage del visitante y hacerlo antes rompería
  // la hidratación.
  useEffect(() => {
    try {
      const guardada = window.localStorage.getItem(CLAVE);
      if (guardada === 'piedra') setCascara('piedra');
    } catch {
      // Ventana privada o almacenamiento bloqueado: se queda con la definitiva.
    }
  }, []);

  useEffect(() => {
    const raiz = document.documentElement;
    if (cascara === 'piedra') raiz.setAttribute('data-cascara', 'piedra');
    else raiz.removeAttribute('data-cascara');

    try {
      window.localStorage.setItem(CLAVE, cascara);
    } catch {
      // Sin persistencia, pero el cambio de la sesión actual sí se aplica.
    }
  }, [cascara]);

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex items-center gap-1 border border-[var(--void-linea-fuerte)] bg-[var(--void-fondo)] p-1 text-[10px] uppercase tracking-[0.16em] text-[var(--void-tinta-dim)]">
      <span className="px-2">Cáscara</span>
      {(['grafito', 'piedra'] as const).map((opcion) => (
        <button
          key={opcion}
          type="button"
          onClick={() => setCascara(opcion)}
          aria-pressed={cascara === opcion}
          className="px-2 py-1 uppercase tracking-[0.16em] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--void-acento)]"
          style={
            cascara === opcion
              ? { backgroundColor: 'var(--void-acento)', color: 'var(--void-fondo)' }
              : undefined
          }
        >
          {opcion}
        </button>
      ))}
    </div>
  );
}
