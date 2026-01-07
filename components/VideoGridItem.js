import { formatDuration } from '../utils/formatDuration';
import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export function VideoGridItem({ programa, priority }) {
    // const [isVideoPlaying, setIsVideoPlaying] = React.useState(false)
    // const videoRef = React.useRef(null)

    let thumbnail = (programa.attributes.portada?.data) ? programa.attributes.portada.data.attributes.url : `https://image.mux.com/${programa.attributes.video_pral.data.attributes.playback_id}/thumbnail.webp?width=256&height=180&time=8`
    let lanzamiento_arr = programa.attributes.lanzamiento.split("-")
    let lanzamiento_ord = lanzamiento_arr[2] + "-" + lanzamiento_arr[1] + "-" + lanzamiento_arr[0]
    
    // Verificar si el programa es destacado
    const esDestacado = programa.attributes.destacado === true

    // useEffect(() => {
    //     if (videoRef.current == null) return
    //     if (isVideoPlaying) {
    //         videoRef.current.currentTime = 0
    //         videoRef.current.play()
    //     } else {
    //         videoRef.current.pause()
    //     }
    // }, [isVideoPlaying])

    return (
        <div
            className='flex flex-col gap-2 shadow-lg mb-4 rounded-xl relative'
            key={programa.id}
        // onMouseEnter={() => setIsVideoPlaying(true)} 
        // onMouseLeave={() => setIsVideoPlaying(false)} 
        >
            {/* Badge de Destacado */}
            {esDestacado && (
                <div className='absolute top-2 left-2 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1'>
                    <span className='text-sm'>⭐</span>
                    <span>DESTACADO</span>
                </div>
            )}
            
            <Link className='relative aspect-video' href={`/programa/${programa.id}`}>
                <Image
                    src={thumbnail}
                    width={256}
                    height={186}
                    {...(priority ? { priority: true } : { loading: "lazy" })}
                    // priority={priority}
                    // loading="lazy"
                    alt={programa.attributes.sintesis}
                    className="block w-full h-full object-cover rounded-xl "
                />
                <div className='absolute bottom-1 right-1 bg-slate-600 text-white text-sm px-0.5 rounded'>
                    {formatDuration(programa.attributes.video_pral.data.attributes.duration)}
                </div>
                {/* <video ref={videoRef} muted playsInline className={`block w-full h-full object-cover rounded-xl absolute inset-0 transition-opacity duration-200 ${isVideoPlaying ? "opacity-100" : "opacity-0" }` } >
                <source src={`https://stream.mux.com/${programa.attributes.video_pral.data.attributes.playback_id}.m3u8`}  type="application/x-mpegURL" />
                </video> */}
            </Link>
            <div className='flex flex-col gap-2 p-2'>
                <div className='flex gap-1'>
                    <a className='font-bold font-sans text-sm md:text-lg' href={`/programa/${programa.id}`}>
                        {programa.attributes.region_estado.data.attributes.nombre_completo} -
                    </a>
                    <a className='font-bold font-sans text-sm md:text-lg' href={`/programa/${programa.id}`}>
                        {lanzamiento_ord}
                    </a>
                </div>
                <div className='text-sm text-slate-800 md:text-base'>
                    {programa.attributes.sintesis}
                </div>
            </div>
        </ div>
    )
}
