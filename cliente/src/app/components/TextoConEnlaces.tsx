import type { ReactNode } from 'react';

function esUrl(s: string): boolean {
  return /^https?:\/\/\S+$/.test(s);
}

export function textoConEnlaces(texto: string): ReactNode[] {
  return texto.split(/(https?:\/\/\S+)/g).map((parte, i) =>
    esUrl(parte) ? (
      <a
        key={i}
        href={parte}
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
        style={{ color: '#547792' }}
      >
        {parte}
      </a>
    ) : (
      <span key={i}>{parte}</span>
    ),
  );
}
