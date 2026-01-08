import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import NavLilia from '../../layouts/NavLilia';
import Footer from '../../layouts/Footer';
import { UserProvider, useFetchUser } from '../../lib/authContext';
import { fetchArticuloBySlug } from '../../actions/fetch-articulos';

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
                                    <span className="text-sm font-semibold text-lilia-primary uppercase tracking-wide hover:underline">
                                        {columnaData.nombre}
                                    </span>
                                </Link>
                            )}

                            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                                {titulo}
                            </h1>

                            {/* Autor y fecha */}
                            <div className="mt-6 flex items-center">
                                {autor && (
                                    <Link href={`/autor/${autor.slug}`} className="flex items-center">
                                        {autorFoto && (
                                            <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3">
                                                <Image
                                                    src={autorFoto}
                                                    alt={autor.nombre || 'Autor'}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <span className="block font-medium text-gray-900 hover:text-lilia-primary">
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
                                    <Link href={`/autor/${autor.slug}`} className="flex items-start">
                                        {autorFoto && (
                                            <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                                                <Image
                                                    src={autorFoto}
                                                    alt={autor.nombre || 'Autor'}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <span className="block font-bold text-gray-900 hover:text-lilia-primary">
                                                {autor.nombre}
                                            </span>
                                            {autor.bio && (
                                                <p className="text-gray-600 text-sm mt-1 line-clamp-3">
                                                    {autor.bio}
                                                </p>
                                            )}
                                            {(autor.twitter_x || autor.instagram) && (
                                                <div className="flex gap-3 mt-2">
                                                    {autor.twitter_x && (
                                                        <a 
                                                            href={`https://twitter.com/${autor.twitter_x.replace('@', '')}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-lilia-primary hover:underline"
                                                        >
                                                            @{autor.twitter_x.replace('@', '')}
                                                        </a>
                                                    )}
                                                    {autor.instagram && (
                                                        <a 
                                                            href={`https://instagram.com/${autor.instagram.replace('@', '')}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-lilia-primary hover:underline"
                                                        >
                                                            📷 {autor.instagram.replace('@', '')}
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
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
