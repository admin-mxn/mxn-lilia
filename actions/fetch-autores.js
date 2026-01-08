"use server";

export async function fetchAutores() {
    try {
        const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/autores?populate[foto][fields][0]=url&populate[columnas][fields][0]=nombre&populate[columnas][fields][1]=slug`;

        console.log('fetchAutores', url);
        const res = await fetch(url);
        const data = await res.json();

        return data.data || [];

    } catch (error) {
        console.error('Failed to fetch autores', error);
        return [];
    }
}

export async function fetchAutorBySlug(slug) {
    try {
        const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/autores?filters[slug][$eq]=${slug}&populate[foto][fields][0]=url&populate[columnas][populate][articulos][populate][imagen][fields][0]=url&populate[columnas][fields][0]=nombre&populate[columnas][fields][1]=slug`;

        const res = await fetch(url);
        const data = await res.json();

        return data.data?.[0] || null;

    } catch (error) {
        console.error('Failed to fetch autor', error);
        return null;
    }
}
