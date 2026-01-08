"use server";

let pageCount = 0;

export async function fetchArticulos({ pageParam = 1, columnaSlug, autorSlug, destacados }) {
    try {
        if (pageCount && pageParam > pageCount) {
            pageParam = pageParam % pageCount - 1;
        }

        let filters = '';
        if (columnaSlug) {
            filters += `&filters[columna][slug][$eq]=${columnaSlug}`;
        }
        if (autorSlug) {
            filters += `&filters[columna][autor][slug][$eq]=${autorSlug}`;
        }
        if (destacados) {
            filters += `&filters[destacado][$eq]=true`;
        }

        const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/articulos-columnas?pagination[page]=${pageParam}&pagination[pageSize]=20&sort=fecha_publicacion:DESC&populate[imagen][fields][0]=url&populate[columna][populate][autor][populate][foto][fields][0]=url&populate[columna][fields][0]=nombre&populate[columna][fields][1]=slug${filters}`;

        console.log('fetchArticulos', url);
        const res = await fetch(url);
        const data = await res.json();
        pageCount = data.meta?.pagination?.pageCount || 0;

        return data.data || [];

    } catch (error) {
        console.error('Failed to fetch articulos', error);
        return [];
    }
}

export async function fetchArticuloBySlug(slug) {
    try {
        const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/articulos-columnas?filters[slug][$eq]=${slug}&populate[imagen][fields][0]=url&populate[columna][populate][autor][populate][foto][fields][0]=url&populate[columna][fields][0]=nombre&populate[columna][fields][1]=slug`;

        const res = await fetch(url);
        const data = await res.json();

        return data.data?.[0] || null;

    } catch (error) {
        console.error('Failed to fetch articulo', error);
        return null;
    }
}
