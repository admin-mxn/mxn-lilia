"use server";

export async function fetchColumnas({ destacadas } = {}) {
    try {
        let filters = '';
        if (destacadas) {
            filters += `&filters[destacada][$eq]=true`;
        }

        const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/columnas?populate[autor][populate][foto][fields][0]=url&populate[imagen][fields][0]=url${filters}`;

        console.log('fetchColumnas', url);
        const res = await fetch(url);
        const data = await res.json();

        return data.data || [];

    } catch (error) {
        console.error('Failed to fetch columnas', error);
        return [];
    }
}

export async function fetchColumnaBySlug(slug) {
    try {
        const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/columnas?filters[slug][$eq]=${slug}&populate[autor][populate][foto][fields][0]=url&populate[imagen][fields][0]=url&populate[articulos][populate][imagen][fields][0]=url&populate[articulos][sort]=fecha_publicacion:DESC`;

        const res = await fetch(url);
        const data = await res.json();

        return data.data?.[0] || null;

    } catch (error) {
        console.error('Failed to fetch columna', error);
        return null;
    }
}
