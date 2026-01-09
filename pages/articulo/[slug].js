import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import NavLilia from '../../layouts/NavLilia';
import Footer from '../../layouts/Footer';
import { UserProvider, useFetchUser } from '../../lib/authContext';
import { fetchArticuloBySlug } from '../../actions/fetch-articulos';
import { colors } from '../../lib/styles';

const ArticuloPage = ({ articulo }) => {
    const { user, loading } = useFetchUser();

    if (!articulo) {
        return (
            <UserProvider value={{ user, loading }}>
                <div className="min-h-screen flex flex-col bg-gray-50">
                    <NavLilia back />
                    <main className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-gray-900">Artículo no encontrado</h1>
                            <Link href="/" className="text-lilia-primary hover:underline mt-4 inline-block">
                                Volver al inicio
                            </Link>
                        </div>
                    </main>
                    <Footer />
                </div>
            </UserProvider>
        );
    }

    const attrs = articulo.attributes || articulo;
    const { titulo, contenido, extracto, fecha_publicacion, imagen, columna } = attrs;
    const columnaData = columna?.data?.attributes || columna;
    const autor = columnaData?.autor?.data?.attributes || columnaData?.autor;
    
    const imagenUrl = imagen?.data?.attributes?.url || imagen?.url;
    const autorFoto = autor?.foto?.data?.attributes?.url || autor?.foto?.url;

    const fechaFormateada = new Date(fecha_publicacion).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <UserProvider value={{ user, loading }}>
            <Head>
                <title>{titulo} | Lilia</title>
                <meta name="description" content={extracto || titulo} />
            </Head>

            <div className="min-h-screen flex flex-col bg-gray-50">
                <NavLilia back />

                <main className="flex-1">
                    <article className="max-w-4xl mx-auto px-4 py-8">
                        {/* Header */}
                        <header className="mb-8">
                            {/* Columna badge */}
                            {columnaData?.nombre && (
                                <Link href={`/columna/${columnaData.slug}`}>
                                    <span 
                                        className="inline-block text-sm font-semibold uppercase tracking-wide px-3 py-1 rounded-bl-lg rounded-tr-lg text-white hover:opacity-80 transition"
                                        style={{ backgroundColor: colors.accent }}
                                    >
                                        {columnaData.nombre}
                                    </span>
                                </Link>
                            )}

                            <h1 
                                className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 leading-tight pl-4"
                                style={{ borderLeft: `4px solid ${colors.accent}` }}
                            >
                                {titulo}
                            </h1>

                            {/* Autor y fecha */}
                            <div className="mt-6 flex items-center">
                                {autor && (
                                    <Link href={`/autor/${autor.slug}`} className="flex items-center">
                                        {autorFoto && (
                                            <div 
                                                className="h-14 w-14 bg-white p-1 rounded-tl-xl rounded-br-xl mr-3 flex-shrink-0"
                                                style={{ border: `3px solid ${colors.border}` }}
                                            >
                                                <div className="relative w-full h-full overflow-hidden rounded-tl-lg rounded-br-lg">
                                                    <Image
                                                        src={autorFoto}
                                                        alt={autor.nombre || 'Autor'}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div>
                                            <span className="block font-medium text-gray-900" style={{ ':hover': { color: colors.accent } }}>
                                                {autor.nombre}
                                            </span>
                                            <time className="text-sm text-gray-500">{fechaFormateada}</time>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        </header>

                        {/* Imagen principal */}
                        {imagenUrl && (
                            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
                                <Image
                                    src={imagenUrl}
                                    alt={titulo}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}

                        {/* Contenido */}
                        <div 
                            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-lilia-primary"
                            dangerouslySetInnerHTML={{ __html: contenido }}
                        />

                        {/* Footer del artículo */}
                        <footer className="mt-12 pt-8 border-t border-gray-200">
                            {autor && (
                                <div className="bg-gray-100 rounded-lg p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Sobre el autor</h3>
                                    <div className="flex items-start">
                                        <Link href={`/autor/${autor.slug}`} className="flex-shrink-0">
                                            {autorFoto && (
                                                <div 
                                                    className="h-20 w-20 bg-white p-1.5 rounded-tl-[1.5rem] rounded-br-[1.5rem] mr-4"
                                                    style={{ border: `4px solid ${colors.border}` }}
                                                >
                                                    <div className="relative w-full h-full overflow-hidden rounded-tl-[1rem] rounded-br-[1rem]">
                                                        <Image
                                                            src={autorFoto}
                                                            alt={autor.nombre || 'Autor'}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </Link>
                                        <div className="flex-1">
                                            <Link href={`/autor/${autor.slug}`}>
                                                <span className="block font-bold text-gray-900 hover:opacity-80" style={{ color: colors.accent }}>
                                                    {autor.nombre}
                                                </span>
                                            </Link>
                                            {autor.bio && (
                                                <p className="text-gray-600 text-sm mt-1 line-clamp-3">
                                                    {autor.bio}
                                                </p>
                                            )}
                                            {(autor.twitter_x || autor.instagram || autor.email) && (
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {autor.twitter_x && (
                                                        <a 
                                                            href={`https://twitter.com/${autor.twitter_x.replace('@', '')}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm px-3 py-1 rounded-bl-lg rounded-tr-lg text-white hover:opacity-80 transition"
                                                            style={{ backgroundColor: colors.border }}
                                                        >
                                                            𝕏 @{autor.twitter_x.replace('@', '')}
                                                        </a>
                                                    )}
                                                    {autor.instagram && (
                                                        <a 
                                                            href={`https://instagram.com/${autor.instagram.replace('@', '')}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm px-3 py-1 rounded-bl-lg rounded-tr-lg text-white hover:opacity-80 transition"
                                                            style={{ backgroundColor: colors.border }}
                                                        >
                                                            📷 @{autor.instagram.replace('@', '')}
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </footer>
                    </article>
                </main>

                <Footer />
            </div>
        </UserProvider>
    );
};

export default ArticuloPage;

export async function getServerSideProps({ params }) {
    const articulo = await fetchArticuloBySlug(params.slug);

    return {
        props: {
            articulo,
        },
    };
}
