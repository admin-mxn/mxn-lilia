import Link from 'next/link';
import Image from 'next/image';

export default function ArticuloCard({ articulo }) {
    const { titulo, extracto, fecha_publicacion, contenido, imagen, slug, columna } = articulo.attributes || articulo;
    const autor = columna?.data?.attributes?.autor?.data?.attributes || columna?.autor;
    const columnaData = columna?.data?.attributes || columna;
    
    const autorFoto = autor?.foto?.data?.attributes?.url || autor?.foto?.url || '/placeholder-avatar.jpg';

    const fechaFormateada = new Date(fecha_publicacion).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Obtener un preview del contenido (primeras líneas)
    const getPreviewText = (html) => {
        if (!html) return extracto || '';
        // Remover tags HTML y obtener texto plano
        const text = html.replace(/<[^>]*>/g, '');
        return text.substring(0, 400) + (text.length > 400 ? '...' : '');
    };

    return (
        <article className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            {/* Header: Autor + Datos de contacto */}
            <div className="flex flex-col md:flex-row gap-4 p-4 bg-gradient-to-r from-blue-50 to-white border-b border-gray-200">
                {/* Foto y nombre del autor */}
                <div className="flex-shrink-0 text-center">
                    <Link href={autor?.slug ? `/autor/${autor.slug}` : '#'}>
                        <div className="w-32 h-32 mx-auto bg-white p-2 rounded-tl-3xl rounded-br-3xl" style={{ border: '3px solid #BBBBBB' }}>
                            <div className="relative w-full h-full overflow-hidden rounded-tl-2xl rounded-br-2xl">
                                <Image
                                    src={autorFoto}
                                    alt={autor?.nombre || 'Autor'}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <p className="mt-2 text-sm font-semibold text-blue-600 italic">
                            {autor?.nombre || 'Autor'}
                        </p>
                    </Link>
                </div>

                {/* Datos de contacto */}
                <div className="flex-1 text-sm text-gray-600 space-y-1">
                    {autor?.url_sitio && (
                        <a href={autor.url_sitio} target="_blank" rel="noopener noreferrer" className="block text-blue-500 hover:underline">
                            {autor.url_sitio.replace('https://', '').replace('http://', '')}
                        </a>
                    )}
                    {autor?.email && (
                        <a href={`mailto:${autor.email}`} className="block text-blue-500 hover:underline">
                            {autor.email}
                        </a>
                    )}
                    {autor?.twitter_x && (
                        <a href={`https://twitter.com/${autor.twitter_x.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="block text-blue-500 hover:underline">
                            @{autor.twitter_x.replace('@', '')}
                        </a>
                    )}
                    {autor?.instagram && (
                        <a href={`https://instagram.com/${autor.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="block text-blue-500 hover:underline">
                            @{autor.instagram.replace('@', '')}
                        </a>
                    )}
                </div>
            </div>

            {/* Nombre de la columna */}
            <div className="px-4 pt-4">
                {columnaData?.nombre && (
                    <Link href={`/columna/${columnaData.slug}`}>
                        <h2 className="text-lg font-bold text-gray-900 hover:text-blue-600">
                            {columnaData.nombre}
                        </h2>
                    </Link>
                )}
            </div>

            {/* Título del artículo como subtítulo/epígrafe */}
            <div className="px-4 py-2">
                <Link href={`/articulo/${slug}`}>
                    <p className="text-gray-700 italic border-l-4 border-blue-400 pl-3">
                        "{titulo}"
                    </p>
                </Link>
            </div>

            {/* Contenido preview */}
            <div className="px-4 pb-4">
                <p className="text-gray-800 text-sm leading-relaxed text-justify">
                    <span className="font-semibold">{fechaFormateada}.-</span> {getPreviewText(contenido)}
                </p>
            </div>

            {/* Botón Leer más */}
            <div className="px-4 pb-4 text-right">
                <Link 
                    href={`/articulo/${slug}`}
                    className="inline-block bg-blue-500 text-white text-sm px-4 py-2 hover:bg-blue-600 transition"
                >
                    Leer mas...
                </Link>
            </div>
        </article>
    );
}
