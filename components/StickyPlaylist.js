'use client';

import { useState, useEffect, useRef } from 'react';
import Playlist from './Playlist';

const StickyPlaylist = ({ playlist }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const containerRef = useRef(null);
  const playerWrapperRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Intersection Observer para detectar cuando el player sale del viewport
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        // Si el player original está fuera del viewport hacia arriba
        const shouldBeSticky = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        setIsSticky(shouldBeSticky);
        
        // Reset minimized cuando vuelve a posición normal
        if (!shouldBeSticky) {
          setIsMinimized(false);
        }
      },
      {
        threshold: 0,
        rootMargin: '-80px 0px 0px 0px' // Offset para el nav
      }
    );

    observerRef.current.observe(container);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const scrollToTop = () => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* Contenedor de referencia para Intersection Observer */}
      <div ref={containerRef} className="w-full">
        {/* Player wrapper - se mueve entre posición normal y flotante */}
        <div 
          ref={playerWrapperRef}
          className={`transition-all duration-300 ${
            isSticky && !isMinimized
              ? 'fixed bottom-20 md:bottom-24 right-3 md:right-6 z-50 w-[320px] md:w-[450px] lg:w-[550px] max-h-[180px] md:max-h-none shadow-2xl rounded-lg overflow-hidden'
              : 'relative w-full max-w-6xl mx-auto px-4 md:px-8'
          }`}
          style={isSticky && !isMinimized ? {
            animation: 'slideInUp 0.3s ease-out'
          } : {}}
        >
          {/* Player - mismo elemento DOM siempre */}
          <div className={isSticky && !isMinimized ? "relative aspect-video" : ""}>
            {/* Barra de controles - solo visible cuando es sticky */}
            {isSticky && !isMinimized && (
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-2 flex justify-between items-center z-20">
                <button
                  onClick={scrollToTop}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded px-3 py-1 text-xs font-medium transition-all flex items-center gap-1"
                  aria-label="Volver arriba"
                >
                  ↑ Ver completo
                </button>
                
                <button
                  onClick={() => setIsMinimized(true)}
                  className="bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full w-7 h-7 flex items-center justify-center transition-all"
                  aria-label="Minimizar video"
                >
                  ✕
                </button>
              </div>
            )}

            <Playlist playlist={playlist} />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
      
      <style jsx global>{`
        /* Asegurar que el media-playlist no tenga padding o márgenes en sticky */
        .fixed media-playlist {
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          width: 100% !important;
          height: 100% !important;
        }
        
        .fixed mux-player {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
        }
        
        /* Asegurar que el contenedor del video respete el ancho completo */
        .fixed .aspect-video {
          width: 100% !important;
          height: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        
        /* Forzar que el video interno ocupe todo el contenedor */
        .fixed media-playlist video,
        .fixed mux-player video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }

        /* Mobile-specific: Force exact dimensions for video element */
        @media (max-width: 767px) {
          .fixed media-playlist,
          .fixed mux-player {
            max-width: 240px !important;
            max-height: 135px !important;
          }

          .fixed media-playlist video,
          .fixed mux-player video {
            max-width: 240px !important;
            max-height: 135px !important;
            min-width: 240px !important;
            min-height: 135px !important;
          }
        }
      `}</style>
    </>
  );
};

export default StickyPlaylist;
