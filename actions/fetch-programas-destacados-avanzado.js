"use server";

export async function fetchProgramasDestacadosAvanzado({ pageParam = 1, pageSize = 10 }) {
    try {
        let programas = [];
        
        // 1. Obtener destacados (sin límite de fecha)
        const destacadosUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/programas?pagination[pageSize]=100&sort=lanzamiento:DESC&populate[video_pral][fields][0]=playback_id&fields[0]=lanzamiento&populate[portada][fields][0]=url&populate[video_pral][fields][1]=duration&populate[region_estado][fields][0]=nombre_completo&fields[1]=sintesis&filters[destacado][$eq]=true`;
        
        const destacadosRes = await fetch(destacadosUrl);
        const destacadosData = await destacadosRes.json();
        
        if (destacadosData.data && destacadosData.data.length > 0) {
            programas = [...destacadosData.data];
        }
        
        // 2. Si necesitamos más contenido, completar con recientes
        const needed = pageSize - programas.length;
        if (needed > 0) {
            const recentesUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/programas?pagination[pageSize]=${needed + 5}&sort=lanzamiento:DESC&populate[video_pral][fields][0]=playback_id&fields[0]=lanzamiento&populate[portada][fields][0]=url&populate[video_pral][fields][1]=duration&populate[region_estado][fields][0]=nombre_completo&fields[1]=sintesis&filters[destacado][$ne]=true`;
            
            const recentesRes = await fetch(recentesUrl);
            const recentesData = await recentesRes.json();
            
            if (recentesData.data) {
                // Filtrar para evitar duplicados
                const existingIds = new Set(programas.map(p => p.id));
                const newPrograms = recentesData.data.filter(p => !existingIds.has(p.id));
                programas = [...programas, ...newPrograms];
            }
        }
        
        // 3. Limitar al tamaño solicitado y aplicar paginación
        const startIndex = (pageParam - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedPrograms = programas.slice(startIndex, endIndex);
        
        console.log(`📊 Playlist: ${destacadosData.data?.length || 0} destacados + ${programas.length - (destacadosData.data?.length || 0)} recientes = ${paginatedPrograms.length} total`);
        
        return paginatedPrograms;
        
    } catch (error) {
        console.error('Failed to fetch programas destacados avanzado', error);
        return [];
    }
}