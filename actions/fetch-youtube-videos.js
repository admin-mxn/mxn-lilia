"use server";

export async function fetchYoutubeVideos({ limit = 10 } = {}) {
    try {
        const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/youtube-videos?pagination[pageSize]=${limit}&sort=fecha_publicacion:DESC&populate=*`;

        console.log('fetchYoutubeVideos', url);
        const res = await fetch(url, { next: { revalidate: 300 } }); // Cache 5 min
        const data = await res.json();

        return data.data || [];

    } catch (error) {
        console.error('Failed to fetch youtube videos', error);
        return [];
    }
}

export async function fetchYoutubeChannel() {
    try {
        const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/youtube-canals?populate=*`;

        const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache 1 hour
        const data = await res.json();

        return data.data?.[0] || null;

    } catch (error) {
        console.error('Failed to fetch youtube channel', error);
        return null;
    }
}

export async function fetchYoutubePlaylists({ limit = 5 } = {}) {
    try {
        const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/youtube-playlists?pagination[pageSize]=${limit}&sort=item_count:DESC&populate=*`;

        const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache 1 hour
        const data = await res.json();

        return data.data || [];

    } catch (error) {
        console.error('Failed to fetch youtube playlists', error);
        return [];
    }
}
