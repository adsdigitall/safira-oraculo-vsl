import React, { useState, useEffect, useRef } from 'react';
import { Play, Sparkles, CheckCircle2, Flame, Clock } from 'lucide-react';

export default function VSLPlayer({ config, liberado, onConcluir }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [cidade, setCidade] = useState('ITAJAÍ');
  const [progresso, setProgresso] = useState(0);

  // 1. Geolocalização Dinâmica da CIDADE do Lead por IP
  useEffect(() => {
    let cancelado = false;

    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelado && data && data.city) {
          setCidade(data.city.toUpperCase());
        }
      })
      .catch(() => {
        fetch('https://ip-api.com/json/')
          .then((res) => res.json())
          .then((data2) => {
            if (!cancelado && data2 && data2.city) {
              setCidade(data2.city.toUpperCase());
            }
          })
          .catch(() => {});
      });

    return () => {
      cancelado = true;
    };
  }, []);

  // 2. Desbloqueio Automático na METADE do Vídeo (Na metade dos 2 a 3 minutos)
  useEffect(() => {
    if (liberado || !isPlaying) return;

    const totalSegundos = config.vslDuracaoSegundos || 150;
    // Libera automaticamente aos 50% (ex: 75 segundos)
    const tempoParaLibera = Math.round(totalSegundos * 0.5);
    let decorrido = 0;

    const interval = setInterval(() => {
      decorrido += 1;
      const pct = Math.min(100, Math.round((decorrido / tempoParaLibera) * 100));
      setProgresso(pct);

      if (decorrido >= tempoParaLibera) {
        clearInterval(interval);
        if (onConcluir) {
          onConcluir();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, config.vslDuracaoSegundos, liberado, onConcluir]);

  const videoRef = useRef(null);

  const handleStart = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const renderVideo = () => {
    let url = (config.vslUrl || '').trim();

    if (url.includes('<iframe')) {
      return (
        <div 
          className="relative w-full h-full overflow-hidden rounded-2xl [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0 [&_iframe]:object-cover [&_iframe]:max-w-full [&_iframe]:max-h-full [&_div]:w-full [&_div]:h-full [&_div]:max-w-full [&_div]:max-h-full [&_div]:overflow-hidden pointer-events-auto" 
          dangerouslySetInnerHTML={{ __html: url }} 
        />
      );
    }

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let embedUrl = url;
      if (url.includes('watch?v=')) {
        const videoId = url.split('watch?v=')[1]?.split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&rel=0&playsinline=1`;
      } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&rel=0&playsinline=1`;
      }
      return (
        <iframe
          src={embedUrl}
          title="Vídeo Explicativo VSL"
          scrolling="no"
          className="absolute inset-0 w-full h-full rounded-2xl border-0 object-cover pointer-events-auto overflow-hidden"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
        ></iframe>
      );
    }

    if (url.includes('vimeo.com')) {
      const vimeoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=${isPlaying ? 1 : 0}&playsinline=1`}
          title="Vídeo Explicativo VSL"
          scrolling="no"
          className="absolute inset-0 w-full h-full rounded-2xl border-0 object-cover pointer-events-auto overflow-hidden"
          allow="autoplay; fullscreen; picture-in-picture; accelerometer; gyroscope"
          allowFullScreen
        ></iframe>
      );
    }

    if (url.endsWith('.mp4') || url.includes('.mp4?')) {
      return (
        <video
          ref={videoRef}
          src={url}
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
          controls
          autoPlay
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover rounded-2xl pointer-events-auto overflow-hidden"
          onPlay={handleStart}
          onEnded={() => onConcluir && onConcluir()}
        >
          Seu navegador não suporta vídeos.
        </video>
      );
    }

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return (
        <iframe
          src={url}
          title="Vídeo VSL Safira Oráculo"
          scrolling="no"
          className="absolute inset-0 w-full h-full rounded-2xl border-0 object-cover pointer-events-auto overflow-hidden"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
        ></iframe>
      );
    }

    return (
      <div className="relative w-full h-full flex items-center justify-center bg-[#1c1210]/90 rounded-2xl overflow-hidden group">
        {!isPlaying ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-t from-[#07040d] via-[#1c1210]/80 to-[#2a1e1c]/40 p-4 sm:p-6 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-[#1c1210]/90 to-[#07040d] z-0"></div>

            <div className="relative z-10 flex flex-col items-center max-w-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 animate-pulse glow-gold">
                ✨ Vídeo Exclusivo Liberado
              </span>

              <button
                type="button"
                onClick={handleStart}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-[#b93415] flex items-center justify-center text-[#1c1210] shadow-2xl hover:scale-105 transition-all duration-300 mb-3 glow-mystic-strong group/btn"
                aria-label="Iniciar VSL"
              >
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-[#1c1210] ml-1 group-hover/btn:scale-110 transition" />
              </button>

              <p className="text-white text-sm sm:text-base font-bold font-mystic drop-shadow-md">
                🔮 Safira Oráculo — Leitura & Instruções
              </p>
              <p className="text-[#cbb8b3]/80 text-[11px] mt-0.5">Assista o vídeo até o final para liberar acesso e você solicitar os seus materiais</p>
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            playsInline
            webkit-playsinline="true"
            x5-playsinline="true"
            controls
            autoPlay
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover rounded-2xl pointer-events-auto overflow-hidden"
            onPlay={handleStart}
            onEnded={() => onConcluir && onConcluir()}
          >
            Seu navegador não suporta vídeos.
          </video>
        )}
      </div>
    );
  };

  const aspectConfig = config.vslAspectRatio || '16:9';

  let aspectStyle = 'aspect-[16/9]';
  let outerWidthStyle = 'max-w-2xl';

  if (aspectConfig === '4:5') {
    aspectStyle = 'aspect-[4/5]';
    outerWidthStyle = 'max-w-[340px] sm:max-w-md';
  } else if (aspectConfig === '9:16') {
    aspectStyle = 'aspect-[9/16]';
    outerWidthStyle = 'max-w-[min(310px,80vw)] sm:max-w-xs';
  }

  return (
    <div className={`w-full max-w-full ${outerWidthStyle} mx-auto space-y-3 overflow-x-hidden px-1`}>
      
      {/* Headline de Urgência Dinâmica com NOME DA CIDADE DO LEAD */}
      <div className="bg-gradient-to-r from-red-950/80 via-[#1c1210] to-amber-950/80 border border-amber-500/40 rounded-2xl p-3 sm:p-3.5 text-center text-xs sm:text-sm font-bold text-amber-200 shadow-lg glow-gold animate-pulse">
        <span className="flex items-center justify-center gap-1.5 font-mystic tracking-wide">
          <Flame className="w-4 h-4 text-amber-400 shrink-0" />
          <span>VÁRIAS PESSOAS EM {cidade} ESTÃO ACABANDO DE ASSISTIR A ESSE VÍDEO — POUCAS VAGAS DISPONÍVEIS NO ALTAR</span>
        </span>
      </div>

      {/* Video Box com Proporção Dinâmica (16:9, 4:5 ou 9:16) - FIXO, SEM SCROLL, CONTEÚDO ENCAIXADO */}
      <div 
        onClick={handleStart}
        className={`relative ${aspectStyle} w-full max-w-full rounded-2xl overflow-hidden bg-[#1c1210] border-2 border-amber-500/40 shadow-2xl glow-mystic mx-auto touch-manipulation select-none flex items-center justify-center`}
        style={{ overflow: 'hidden' }}
      >
        {renderVideo()}
      </div>

      {/* Headline de Status e Botão de Liberação na Metade do Vídeo */}
      {!liberado ? (
        <div className="bg-[#1c1210]/90 border border-amber-500/30 rounded-xl p-3.5 text-xs space-y-3 shadow-md">
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
            <span className="flex items-center gap-1.5 leading-snug">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" /> 
              Assista o vídeo até o final para liberar acesso e você solicitar os seus materiais
            </span>
          </div>

          {isPlaying && (
            <div className="w-full h-2 rounded-full bg-[#2a1e1c] overflow-hidden border border-amber-500/20">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                style={{ width: `${progresso}%` }}
              />
            </div>
          )}

          <button
            type="button"
            onClick={onConcluir}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-2 transition shadow-md"
          >
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Já assisti o vídeo • Liberar Acesso e Materiais</span>
          </button>
        </div>
      ) : (
        <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-3 text-center text-xs font-bold text-emerald-300 flex items-center justify-center gap-2 shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>🎉 ACESSO LIBERADO! SELECIONE OS SEUS MATERIAIS NO MENU AO LADO.</span>
        </div>
      )}
    </div>
  );
}
