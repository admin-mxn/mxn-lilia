"use client";
import { formatDuration } from '../utils/formatDuration';
import React from 'react'
import { VideoGridItem } from './VideoGridItem';
import { AdDisplayHorizontal } from './AdSense';
import dynamic from 'next/dynamic';
import Masonry from 'react-masonry-css';

// Importar NotaGridItem dinámicamente para evitar problemas de SSR
const NotaGridItem = dynamic(() => import('./NotaGridItem'), { ssr: false });

const Programas = ({ programas }) => {

  // Configuración de Masonry responsive (adaptado para mix de videos y notas)
  const breakpointColumnsObj = {
    default: 4,  // 4 columnas en pantallas grandes
    1280: 4,     // xl: 4 columnas  
    1024: 3,     // lg: 3 columnas
    768: 2,      // md: 2 columnas
    640: 2,      // sm: 2 columnas
    480: 1       // mobile: 1 columna
  };

  return (
    <>
      <div className='bg-zinc-100 p-4 md:p-8'>
        {/* Contenedor con ancho máximo para pantallas grandes */}
        <div className="max-w-7xl mx-auto">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex -ml-4 md:-ml-6 w-auto"
            columnClassName="pl-4 md:pl-6 bg-clip-padding"
          >
          {programas &&
            programas.map((item, index) => {
              let priority = false
              if (index === 0) return null // skip the first one
              if(index < 5) {
                priority = true
              } 
              
              // Renderizar según el tipo de item
              if (item.type === 'nota') {
                return (
                  <div key={`nota-${item.id}`} className="mb-4 md:mb-6">
                    <NotaGridItem 
                      nota={item} 
                      priority={priority}
                      variant="masonry"
                    />
                  </div>
                );
              } else {
                // Es un programa de video
                return (
                  <div key={`programa-${item.id}`} className="mb-4 md:mb-6">
                    <VideoGridItem 
                      programa={item} 
                      priority={priority} 
                    />
                  </div>
                );
              }
            })}
          </Masonry>
        </div>
      </div>
    </>
  );
};

export default Programas;
