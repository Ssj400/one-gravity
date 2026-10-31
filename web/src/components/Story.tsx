import type { ReactNode } from "react";

/** Argumento de cada escala: la pregunta, qué hicimos y qué encontramos, antes de las figuras. */
export function Story({ question, did, found }: { question: ReactNode; did: ReactNode; found: ReactNode }) {
  return (
    <section className="story" aria-label="Argumento">
      <h2 className="story-question">{question}</h2>
      <div className="story-cols">
        <div>
          <p className="story-label">Qué hicimos</p>
          <p>{did}</p>
        </div>
        <div>
          <p className="story-label">Qué encontramos</p>
          <p>{found}</p>
        </div>
      </div>
    </section>
  );
}

/** Cierre de cada escala: qué significa el resultado y qué no demuestra. */
export function Takeaway({ children }: { children: ReactNode }) {
  return (
    <section className="takeaway" aria-label="Por qué importa">
      <p className="story-label">Por qué importa</p>
      {children}
    </section>
  );
}
