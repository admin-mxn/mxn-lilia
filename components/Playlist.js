import Link from 'next/link';
import MuxPlayer from "@mux/mux-player-react";
import { useRef, useState, useEffect } from 'react';
// import MinimalTheme from '@mux/mux-player-react/themes/minimal'
import PlayerTheme from '@mux/mux-player-react/themes/microvideo'

const ImagenPortada = ({ thumbnail, titulo, sintesis, link }) => {
  return (
    <>
      <Link className={`relative flex flex-col rounded-xl   justify-end xl:justify-center`} href={link}>
        <img src={thumbnail} alt={sintesis} className=" aspect-video w-full  object-cover object-left-top rounded-xl" />
        <div className='absolute max-w-fit bg-black bg-opacity-30 p-5 xl:p-10 rounded-2xl   '>
          <div className='text-white text-lg md:text-4xl font-bold'>
            {titulo}
          </div>
          <div className='text-white text-sm  md:text-xl font-bold'>
            {sintesis}
          </div>
        </div>
      </Link>
    </>
  )
}

const Playlist = ({ playlist }) => {
  console.log(`🎬 Playlist cargada con ${playlist?.length || 0} videos`)
  const playlistRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Si no hay playlist o está vacía, no mostrar nada
  if (!playlist || playlist.length === 0) {
    return (
      <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No hay videos disponibles</p>
      </div>
    )
  }

  const goToNext = () => {
    if (playlistRef.current && currentIndex < playlist.length - 1) {
      // Acceder directamente al método del web component
      playlistRef.current.next();
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
    }
  };

  const goToPrevious = () => {
    if (playlistRef.current && currentIndex > 0) {
      // Acceder directamente al método del web component
      playlistRef.current.previous();
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="relative group w-full">
      <media-playlist 
        ref={playlistRef}
        autoplay
        loop
        style={{
          aspectRatio: "16/9",
          width: "100%",
          display: "block"
        }}
        onEnded={() => console.log('🏁 Playlist terminada')}
      >
        {
          playlist.map((programa, index) => {
            // Validar que el programa tenga los datos necesarios
            if (!programa?.attributes?.video_pral?.data?.attributes?.playback_id) {
              console.warn(`⚠️ Programa ${programa?.id} no tiene video válido`)
              return null
            }

            return (
              <media-playlist-item
                type="mux-player"
                theme={PlayerTheme}
                key={programa.id} 
                autoplay
                muted
                playback-id={programa.attributes.video_pral.data.attributes.playback_id}
                stream-type="on-demand"
              ></media-playlist-item>
            )
          }).filter(Boolean) // Filtrar elementos null
        }
      </media-playlist>

      {/* Controles de navegación - visible al hover */}
      <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className={`pointer-events-auto bg-black/70 hover:bg-black/90 text-white rounded-full p-3 md:p-4 transition-all duration-200 ${
            currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'
          }`}
          aria-label="Video anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={goToNext}
          disabled={currentIndex === playlist.length - 1}
          className={`pointer-events-auto bg-black/70 hover:bg-black/90 text-white rounded-full p-3 md:p-4 transition-all duration-200 ${
            currentIndex === playlist.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'
          }`}
          aria-label="Video siguiente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Indicador de posición */}
      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
        {currentIndex + 1} / {playlist.length}
      </div>
    </div>
  )
}

export default Playlist;