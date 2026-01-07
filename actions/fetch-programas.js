"use server";
let pageCount = 0
export async function fetchProgramas({ pageParam, region_estado, seccion }) {
    try {
        // console.log('fetchProgramas', pageCount )
        // console.log('fetchProgramas region_estado', region_estado )
        // console.log('fetchProgramas seccion', seccion )

        if (pageCount && pageParam > pageCount) {
           pageParam = pageParam % pageCount -1
        }
        // const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/programas?populate=*&sort=lanzamiento:DESC&pagination[page]=${pageParam}&pagination[pageSize]=100${region_estado ? `&filters[$and][0][region_estado][nombre_completo][$eq]=${region_estado}` : '' }${seccion ? `&filters[secciones][$contains]=${seccion}` : '' }`  
        // Ordenar solo por fecha de lanzamiento descendente (más reciente primero)
        // Esto asegura que TODOS los programas recientes aparezcan, sean destacados o no
        const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/programas?pagination[page]=${pageParam}&pagination[pageSize]=100&sort=lanzamiento:DESC&populate[video_pral][fields][0]=playback_id&fields[0]=lanzamiento&populate[portada][fields][0]=url&populate[video_pral][fields][1]=duration&populate[region_estado][fields][0]=nombre_completo&fields[1]=sintesis&fields[2]=destacado${region_estado ? `&filters[$and][0][region_estado][nombre_completo][$eq]=${region_estado}` : '' }${seccion ? `&filters[secciones][$contains]=${seccion}` : '' }`  
        
         console.log('fetchProgramas', url )
        const res = await fetch(url)
        const data = await res.json()
        pageCount = data.meta.pagination.pageCount
        
        // console.log(`'fetchProgramas'`, {data} )
        // console.log(`'fetchProgramas' ${pageParam}`, pageCount )
        return data.data

    } catch (error) {
        console.error('Failed to fetch data', error)
        return null
    }

}