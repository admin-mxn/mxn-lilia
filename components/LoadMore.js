"use client";

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Programas from '../components/Programas';
import { fetchMasContenidoMezclado } from '../actions/fetch-programas-destacados';

const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );
  
export function LoadMore() {
    const [programas, setProgramas] = useState([]);
    const [pagesLoaded, setPagesLoaded] = useState(1);
    const { ref, inView } = useInView();

    const loadMoreProgramas = async () => {
        console.log("Loading more contenido mezclado (programas + notas)")
        await delay(1000)
        const nextPage = pagesLoaded + 1;
        const newContenido = await fetchMasContenidoMezclado({ pageParam: nextPage }) ?? [];
        
        console.log(`📦 Página ${nextPage} cargada:`, newContenido.length, 'items');
        setProgramas((prevProgramas) => [...prevProgramas, ...newContenido]);
        setPagesLoaded(nextPage);
    }

    useEffect(() => {
        if (inView) {
            console.log("scrolled to the end")
            loadMoreProgramas()
        }
    }, [inView])
    return (
        <>
            <Programas programas={programas} />

            <div ref={ref} className='flex justify-center items-center p-4 col-span-1 sm:col-span-2 md:col-span-3'>
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            </div>
        </>
    )
}