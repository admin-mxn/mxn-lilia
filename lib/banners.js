/**
 * Obtiene banners activos desde Strapi
 * @param {string} position - Posición de los banners: 'top', 'bottom', etc., o undefined para todos
 * @returns {Promise<Array>} Array de banners activos
 */
export async function getActiveBanners(position = undefined) {
  try {
    const queryParams = position ? `?position=${position}` : '';
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/banners-active${queryParams}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Error fetching banners:', response.statusText);
      return [];
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching banners:', error);
    return [];
  }
}

/**
 * Selecciona un banner aleatorio basado en pesos
 * @param {Array} banners - Array de banners con propiedad 'peso'
 * @returns {Object|null} Banner seleccionado o null
 */
export function selectWeightedRandomBanner(banners) {
  if (!banners || banners.length === 0) return null;
  
  // Calcular el total de pesos
  const totalWeight = banners.reduce((sum, banner) => sum + (banner.peso || 1), 0);
  
  // Generar un número aleatorio entre 0 y el total de pesos
  let random = Math.random() * totalWeight;
  
  // Seleccionar el banner basado en el peso
  for (const banner of banners) {
    random -= (banner.peso || 1);
    if (random <= 0) {
      return banner;
    }
  }
  
  // Fallback: retornar el primer banner
  return banners[0];
}

/**
 * Obtiene la URL completa de la imagen del banner
 * @param {Object} banner - Banner object
 * @returns {string} URL de la imagen
 */
export function getBannerImageUrl(banner) {
  if (!banner || !banner.imagen) return null;
  
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL.replace('/api', '');
  
  // Si la URL ya es absoluta, retornarla directamente
  if (banner.imagen.url.startsWith('http')) {
    return banner.imagen.url;
  }
  
  // Si es relativa, agregarle el dominio de Strapi
  return `${baseUrl}${banner.imagen.url}`;
}

/**
 * Obtiene la URL de la imagen en un formato específico
 * @param {Object} banner - Banner object
 * @param {string} format - Formato deseado: 'thumbnail', 'small', 'medium', 'large'
 * @returns {string} URL de la imagen en el formato solicitado o la URL original
 */
export function getBannerImageFormat(banner, format = 'large') {
  if (!banner || !banner.imagen) return null;
  
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL.replace('/api', '');
  
  // Intentar obtener el formato específico
  if (banner.imagen.formats && banner.imagen.formats[format]) {
    const formatUrl = banner.imagen.formats[format].url;
    if (formatUrl.startsWith('http')) {
      return formatUrl;
    }
    return `${baseUrl}${formatUrl}`;
  }
  
  // Fallback a la imagen original
  return getBannerImageUrl(banner);
}
