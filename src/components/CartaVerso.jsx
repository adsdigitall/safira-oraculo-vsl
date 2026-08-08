import React from 'react';

// ─────────────────────────────────────────────────────────────
//  Verso ornamentado de carta de tarô — ouro gravado em SVG.
//  Moldura dupla, flores de canto, sol no topo, lua na base e
//  um medalhão central que recebe o símbolo da carta.
// ─────────────────────────────────────────────────────────────

// Uma flor de canto desenhada no espaço do canto superior-esquerdo.
function FlorCanto() {
  return (
    <g stroke="#5c3f08" strokeWidth="1.6" fill="none" strokeLinecap="round">
      <path d="M14 46 C14 28, 28 14, 46 14" />
      <path d="M20 46 C20 32, 32 20, 46 20" opacity="0.7" />
      <path d="M26 30 C30 26, 36 26, 38 32 C34 34, 28 34, 26 30 Z" fill="#5c3f08" stroke="none" />
      <circle cx="24" cy="24" r="2.4" fill="#5c3f08" stroke="none" />
    </g>
  );
}

export default function CartaVerso({ simbolo }) {
  return (
    <>
      <svg
        className="quiz-carta__svg"
        viewBox="0 0 200 300"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <linearGradient id="ouroFundo" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fbe7a6" />
            <stop offset="0.45" stopColor="#d8ab2e" />
            <stop offset="1" stopColor="#9a7113" />
          </linearGradient>
          <radialGradient id="brilhoTopo" cx="0.5" cy="0.28" r="0.6">
            <stop offset="0" stopColor="#fff6d8" stopOpacity="0.9" />
            <stop offset="1" stopColor="#fff6d8" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="medalhao" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2b1656" />
            <stop offset="1" stopColor="#150a30" />
          </linearGradient>
        </defs>

        {/* Fundo dourado */}
        <rect x="0" y="0" width="200" height="300" rx="12" fill="url(#ouroFundo)" />
        <rect x="0" y="0" width="200" height="300" rx="12" fill="url(#brilhoTopo)" />

        {/* Molduras */}
        <rect x="7" y="7" width="186" height="286" rx="9" fill="none" stroke="#5c3f08" strokeWidth="2.4" />
        <rect x="12" y="12" width="176" height="276" rx="7" fill="none" stroke="#fce9ad" strokeWidth="1" opacity="0.8" />
        <rect
          x="17" y="17" width="166" height="266" rx="6"
          fill="none" stroke="#5c3f08" strokeWidth="0.8"
          strokeDasharray="1 4" opacity="0.7"
        />

        {/* Flores nos 4 cantos (uma desenhada, 3 espelhadas) */}
        <FlorCanto />
        <g transform="translate(200,0) scale(-1,1)"><FlorCanto /></g>
        <g transform="translate(0,300) scale(1,-1)"><FlorCanto /></g>
        <g transform="translate(200,300) scale(-1,-1)"><FlorCanto /></g>

        {/* Sol no topo */}
        <g stroke="#5c3f08" strokeWidth="1.4" fill="none">
          <circle cx="100" cy="34" r="6" fill="#5c3f08" stroke="none" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            const x1 = 100 + Math.cos(a) * 9;
            const y1 = 34 + Math.sin(a) * 9;
            const x2 = 100 + Math.cos(a) * 13;
            const y2 = 34 + Math.sin(a) * 13;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </g>

        {/* Lua na base */}
        <path
          d="M100 254 a11 11 0 1 0 7 19 a13 13 0 1 1 -7 -19 Z"
          fill="#5c3f08"
        />

        {/* Medalhão central */}
        <circle cx="100" cy="150" r="52" fill="url(#medalhao)" stroke="#5c3f08" strokeWidth="3" />
        <circle cx="100" cy="150" r="52" fill="none" stroke="#fce9ad" strokeWidth="1" opacity="0.6" />
        <circle cx="100" cy="150" r="46" fill="none" stroke="#c9a13f" strokeWidth="0.8" strokeDasharray="1 3" />
      </svg>

      {/* Símbolo sobre o medalhão */}
      <span className="quiz-carta__emblema">{simbolo}</span>
    </>
  );
}
