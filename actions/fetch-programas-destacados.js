"use server";

export async function fetchProgramasConDestacados({ pageParam = 1, pageSize = 100 }) {
    try {
        // 1. Obtener todos los programas destacados (sin límite de fecha)
        // IMPORTANTE: incluir fields[2]=destacado para que Strapi lo devuelva
        const destacadosUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/programas?pagination[pageSize]=100&sort=lanzamiento:DESC&populate[video_pral][fields][0]=playback_id&fields[0]=lanzamiento&populate[portada][fields][0]=url&populate[video_pral][fields][1]=duration&populate[region_estado][fields][0]=nombre_completo&fields[1]=sintesis&fields[2]=destacado&filters[destacado][$eq]=true`
        
        const destacadosRes = await fetch(destacadosUrl)
        const destacadosData = await destacadosRes.json()
        const destacados = destacadosData.data || []
        
        // 2. Obtener programas recientes (excluyendo destacados para evitar duplicados)
        // IMPORTANTE: Usar [$or] con [$null] y [$eq]=false para capturar todos los no-destacados
        const recentesUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/programas?pagination[page]=${pageParam}&pagination[pageSize]=${pageSize}&sort=lanzamiento:DESC&populate[video_pral][fields][0]=playback_id&fields[0]=lanzamiento&populate[portada][fields][0]=url&populate[video_pral][fields][1]=duration&populate[region_estado][fields][0]=nombre_completo&fields[1]=sintesis&fields[2]=destacado&filters[$or][0][destacado][$null]=true&filters[$or][1][destacado][$eq]=false`
        
        const recentesRes = await fetch(recentesUrl)
        const recentesData = await recentesRes.json()
        const recientes = recentesData.data || []
        
        // 2.5 Obtener notas de newsletter recientes
        const notasUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/newsletter-notas?pagination[pageSize]=30&sort=createdAt:DESC&fields[0]=titulo&fields[1]=descripcion&fields[2]=url_original&fields[3]=seccion&fields[4]=autor&fields[5]=createdAt&fields[6]=estado_verificacion`
        
        const notasRes = await fetch(notasUrl)
        const notasData = await notasRes.json()
        const notas = notasData.data || []
        
        // 3. Crear array mezclado de forma orgánica INCLUYENDO NOTAS
        // Estrategia: Mezclar destacados en los primeros ~20 resultados + notas cada 5-7 items
        const mezclados = [];
        
        if (destacados.length === 0 && recientes.length === 0) {
            // Solo notas si no hay programas
            mezclados.push(...notas.map(n => ({ ...n, type: 'nota' })));
        } else {
            // Mezcla orgánica: destacados concentrados al inicio + notas distribuidas naturalmente
            const zonaDestacados = Math.max(20, destacados.length * 3);
            const intervaloPorDestacado = Math.floor(zonaDestacados / Math.max(destacados.length, 1));
            
            // Aumentar cantidad de notas: una por cada 2 programas (33% de contenido serán notas)
            const totalProgramas = destacados.length + Math.min(recientes.length, 50);
            const notasAInsertar = Math.min(notas.length, Math.floor(totalProgramas / 2));
            
            // Calcular posiciones orgánicas para notas (no mecánicas)
            const posicionesNotas = [];
            if (notasAInsertar > 0) {
                const espacioTotal = totalProgramas + notasAInsertar;
                const intervaloBase = Math.floor(espacioTotal / notasAInsertar);
                
                for (let i = 0; i < notasAInsertar; i++) {
                    // Añadir variación aleatoria ±1 para que no sea mecánico
                    const variacion = Math.floor(Math.random() * 3) - 1; // -1, 0, o 1
                    const posicion = (i * intervaloBase) + intervaloBase + variacion;
                    posicionesNotas.push(Math.max(2, posicion)); // Mínimo en posición 2
                }
            }
            
            let indexRecientes = 0;
            let indexDestacados = 0;
            let indexNotas = 0;
            let posicionActual = 0;
            
            // Crear la zona mezclada con distribución orgánica
            while (mezclados.length < 100 && (indexRecientes < recientes.length || indexDestacados < destacados.length || indexNotas < notasAInsertar)) {
                const proximaPosicionDestacado = indexDestacados * intervaloPorDestacado;
                const esZonaDestacados = posicionActual < zonaDestacados;
                
                // Insertar nota en posición orgánica calculada
                if (posicionesNotas.includes(mezclados.length) && indexNotas < notasAInsertar) {
                    mezclados.push({ ...notas[indexNotas], type: 'nota' });
                    indexNotas++;
                } 
                // Insertar destacado si estamos en la zona y toca
                else if (esZonaDestacados && indexDestacados < destacados.length && posicionActual >= proximaPosicionDestacado) {
                    mezclados.push({ ...destacados[indexDestacados], type: 'programa' });
                    indexDestacados++;
                } 
                // Insertar reciente
                else if (indexRecientes < recientes.length) {
                    mezclados.push({ ...recientes[indexRecientes], type: 'programa' });
                    indexRecientes++;
                }
                
                posicionActual++;
            }
        }
        
        // 4. Crear playlist dinámico e inteligente
        // Tamaño basado en cantidad de destacados: mín 10, máx 20
        const basePlaylistSize = 10;
        const playlistSizePorDestacado = 2; // 2 videos por cada destacado
        const maxPlaylistSize = Math.min(20, Math.max(basePlaylistSize, destacados.length * playlistSizePorDestacado));
        
        const playlist = [];
        const usedIds = new Set();
        
        // Estrategia similar al grid: mezclar destacados con recientes
        if (destacados.length === 0) {
            // Sin destacados: tomar primeros recientes
            recientes.forEach(r => {
                if (playlist.length < maxPlaylistSize && r?.attributes?.video_pral?.data?.attributes?.playback_id) {
                    playlist.push(r);
                    usedIds.add(r.id);
                }
            });
        } else {
            // Con destacados: mezclar inteligentemente
            const intervaloEnPlaylist = Math.floor(maxPlaylistSize / destacados.length);
            let indexRecientesPlaylist = 0;
            let indexDestacadosPlaylist = 0;
            let posicionPlaylist = 0;
            
            while (playlist.length < maxPlaylistSize && (indexRecientesPlaylist < recientes.length || indexDestacadosPlaylist < destacados.length)) {
                const proximaPosicionDestacado = indexDestacadosPlaylist * intervaloEnPlaylist;
                
                if (indexDestacadosPlaylist < destacados.length && 
                    posicionPlaylist >= proximaPosicionDestacado &&
                    destacados[indexDestacadosPlaylist]?.attributes?.video_pral?.data?.attributes?.playback_id) {
                    // Agregar destacado
                    playlist.push(destacados[indexDestacadosPlaylist]);
                    usedIds.add(destacados[indexDestacadosPlaylist].id);
                    indexDestacadosPlaylist++;
                } else if (indexRecientesPlaylist < recientes.length) {
                    // Agregar reciente (sin duplicar)
                    const reciente = recientes[indexRecientesPlaylist];
                    if (!usedIds.has(reciente.id) && reciente?.attributes?.video_pral?.data?.attributes?.playback_id) {
                        playlist.push(reciente);
                        usedIds.add(reciente.id);
                    }
                    indexRecientesPlaylist++;
                }
                
                posicionPlaylist++;
            }
        }
        
        // Mezclar aleatoriamente el playlist usando Fisher-Yates shuffle
        for (let i = playlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
        }
        
        return {
            playlist: playlist, // Playlist optimizada con destacados + recientes
            grid: mezclados, // Para el grid mezclado
            destacados: destacados,
            recientes: recientes,
            meta: {
                destacados: destacados.length,
                recientes: recientes.length,
                total: mezclados.length,
                playlistSize: playlist.length
            }
        }

    } catch (error) {
        console.error('Failed to fetch programas con destacados', error)
        return { playlist: [], grid: [], destacados: [], recientes: [], meta: {} }
    }
}

// Función para cargar más contenido mezclado (páginas adicionales)
export async function fetchMasContenidoMezclado({ pageParam = 2, pageSize = 50 }) {
    try {
        // Obtener destacados para repetir en el scroll
        const destacadosUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/programas?pagination[pageSize]=100&sort=lanzamiento:DESC&populate[video_pral][fields][0]=playback_id&fields[0]=lanzamiento&populate[portada][fields][0]=url&populate[video_pral][fields][1]=duration&populate[region_estado][fields][0]=nombre_completo&fields[1]=sintesis&fields[2]=destacado&filters[destacado][$eq]=true`
        
        // Obtener programas recientes para la página solicitada
        const recentesUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/programas?pagination[page]=${pageParam}&pagination[pageSize]=${pageSize}&sort=lanzamiento:DESC&populate[video_pral][fields][0]=playback_id&fields[0]=lanzamiento&populate[portada][fields][0]=url&populate[video_pral][fields][1]=duration&populate[region_estado][fields][0]=nombre_completo&fields[1]=sintesis&fields[2]=destacado&filters[$or][0][destacado][$null]=true&filters[$or][1][destacado][$eq]=false`
        
        // Obtener notas paginadas también
        const notasUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/newsletter-notas?pagination[page]=${pageParam}&pagination[pageSize]=15&sort=createdAt:DESC&fields[0]=titulo&fields[1]=descripcion&fields[2]=url_original&fields[3]=seccion&fields[4]=autor&fields[5]=createdAt&fields[6]=estado_verificacion`
        
        const [destacadosRes, recentesRes, notasRes] = await Promise.all([
            fetch(destacadosUrl),
            fetch(recentesUrl),
            fetch(notasUrl)
        ]);
        
        const destacadosData = await destacadosRes.json()
        const recentesData = await recentesRes.json()
        const notasData = await notasRes.json()
        
        const destacados = destacadosData.data || []
        const recientes = recentesData.data || []
        const notas = notasData.data || []
        
        // Mezcla orgánica: destacados distribuidos + notas cada ~3 items
        const mezclados = [];
        
        // Simplificar: insertar algunos destacados (max 7), más notas (15) en los 50 recientes
        const destacadosAInsertar = Math.min(destacados.length, 7);
        const notasAInsertar = Math.min(notas.length, 15);
        
        // Calcular posiciones orgánicas para destacados (distribuidos en primeros ~40 items)
        const posicionesDestacados = [];
        if (destacadosAInsertar > 0) {
            const intervaloDestacados = Math.floor(40 / destacadosAInsertar);
            for (let i = 0; i < destacadosAInsertar; i++) {
                const variacion = Math.floor(Math.random() * 3) - 1;
                const posicion = (i * intervaloDestacados) + intervaloDestacados + variacion;
                posicionesDestacados.push(Math.max(2, posicion));
            }
        }
        
        // Calcular posiciones orgánicas para notas
        const posicionesNotas = [];
        if (notasAInsertar > 0) {
            const espacioTotal = 60; // Espacio estimado
            const intervaloBase = Math.floor(espacioTotal / notasAInsertar);
            
            for (let i = 0; i < notasAInsertar; i++) {
                const variacion = Math.floor(Math.random() * 3) - 1;
                let posicion = (i * intervaloBase) + intervaloBase + variacion;
                
                // Simple check: evitar posiciones muy cercanas a destacados
                const muyCerca = posicionesDestacados.some(d => Math.abs(d - posicion) < 2);
                if (muyCerca) posicion += 2;
                
                posicionesNotas.push(Math.max(1, posicion));
            }
        }
        
        let indexRecientes = 0;
        let indexNotas = 0;
        let indexDestacados = 0;
        
        // Limitar el loop a 70 items máximo
        const maxItems = 70;
        
        while (mezclados.length < maxItems && 
               (indexRecientes < recientes.length || indexNotas < notasAInsertar || indexDestacados < destacadosAInsertar)) {
            
            // Insertar destacado en posición orgánica
            if (posicionesDestacados.includes(mezclados.length) && indexDestacados < destacadosAInsertar) {
                mezclados.push({ ...destacados[indexDestacados], type: 'programa' });
                indexDestacados++;
            }
            // Insertar nota en posición orgánica
            else if (posicionesNotas.includes(mezclados.length) && indexNotas < notasAInsertar) {
                mezclados.push({ ...notas[indexNotas], type: 'nota' });
                indexNotas++;
            }
            // Insertar programa reciente
            else if (indexRecientes < recientes.length) {
                mezclados.push({ ...recientes[indexRecientes], type: 'programa' });
                indexRecientes++;
            } else {
                // Salida de seguridad
                break;
            }
        }
        
        return mezclados;    } catch (error) {
        console.error('Failed to fetch más contenido mezclado', error)
        return []
    }
}