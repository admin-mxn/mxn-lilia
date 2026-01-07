"use server";

let pageCount = 0;

export async function fetchNewsletterNotas({ 
  pageParam = 1, 
  seccion = null, 
  search = null,
  orderBy = 'createdAt:DESC' 
}) {
  try {
    // Construir filtros
    let filters = [];
    
    if (seccion) {
      filters.push(`filters[seccion][$eq]=${encodeURIComponent(seccion)}`);
    }
    
    if (search) {
      filters.push(`filters[$or][0][titulo][$containsi]=${encodeURIComponent(search)}`);
      filters.push(`filters[$or][1][descripcion][$containsi]=${encodeURIComponent(search)}`);
    }
    
    const filtersString = filters.length > 0 ? `&${filters.join('&')}` : '';
    
    // Construir URL completa
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/newsletter-notas?` +
      `pagination[page]=${pageParam}&` +
      `pagination[pageSize]=20&` +
      `sort=${orderBy}&` +
      `populate[0]=portada&` +
      `fields[0]=titulo&` +
      `fields[1]=descripcion&` +
      `fields[2]=url&` +
      `fields[3]=seccion&` +
      `fields[4]=autor&` +
      `fields[5]=newsletterOrigen&` +
      `fields[6]=createdAt&` +
      `fields[7]=verificado` +
      filtersString;

    console.log('Fetching newsletter notas:', url);
    
    const res = await fetch(url, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    pageCount = data.meta.pagination.pageCount;
    
    console.log(`Newsletter notas fetched - Page ${pageParam}/${pageCount}`, {
      total: data.meta.pagination.total,
      results: data.data.length
    });
    
    return {
      data: data.data,
      pagination: data.meta.pagination
    };

  } catch (error) {
    console.error('Failed to fetch newsletter notas:', error);
    return {
      data: [],
      pagination: {
        page: 1,
        pageSize: 20,
        pageCount: 0,
        total: 0
      }
    };
  }
}

/**
 * Obtener secciones disponibles para filtrado
 */
export async function fetchNewsletterSecciones() {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/newsletter-notas?` +
      `pagination[pageSize]=1000&` +
      `fields[0]=seccion`;
    
    const res = await fetch(url, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    
    // Extraer secciones únicas
    const secciones = [...new Set(
      data.data
        .map(nota => nota.attributes.seccion)
        .filter(seccion => seccion && seccion.trim() !== '')
    )].sort();
    
    return secciones;
    
  } catch (error) {
    console.error('Failed to fetch newsletter secciones:', error);
    return [];
  }
}

/**
 * Obtener estadísticas del newsletter
 */
export async function fetchNewsletterStats() {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/newsletter-notas?` +
      `pagination[pageSize]=1&` +
      `fields[0]=id`;
    
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    
    return {
      totalNotas: data.meta.pagination.total,
      lastUpdate: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Failed to fetch newsletter stats:', error);
    return {
      totalNotas: 0,
      lastUpdate: new Date().toISOString()
    };
  }
}