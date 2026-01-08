import Link from 'next/link';
import Image from 'next/image';

export default function ArticuloCard({ articulo }) {
    const { titulo, extracto, fecha_publicacion, imagen, slug, columna } = articulo.attributes || articulo;
    const autor = columna?.data?.attributes?.autor?.data?.attributes || columna?.autor;
    const columnaData = columna?.data?.attributes || columna;
    
    const imagenUrl = imagen?.data?.attributes?.url || imagen?.url || '/placeholder-article.jpg';
    const autorFoto = autor?.foto?.data?.attributes?.url || autor?.foto?.url || '/placeholder-avatar.jpg';

    const fechaFormateada = new Date(fecha_publicacion).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <Link href={`/articulo/${slug}`}>
                <div className="relative h-48 w-full">
                    <Image
                        src={imagenUrl}
                        alt={titulo}
                        fill
                        className="object-cover"
                    />
                </div>
            </Link>
            
            <div className="p-4">
                {/* Columna badge */}
                {columnaData?.nombre && (
                    <Link href={`/columna/${columnaData.slug}`}>
                        <span className="text-xs font-semibold text-lilia-primary uppercase tracking-wide hover:underline">
                            {columnaData.nombre}
                        </span>
                    </Link>
                )}
                
                {/* Título */}
                <Link href={`/articulo/${slug}`}>
                    <h2 className="mt-2 text-xl font-bold text-gray-900 hover:text-lilia-primary line-clamp-2">
                        {titulo}
                    </h2>
                </Link>
                
                {/* Extracto */}
                {extracto && (
                    <p className="mt-2 text-gray-600 text-sm line-clamp-3">
                        {extracto}
                    </p>
                )}
                
                {/* Autor y fecha */}
                <div className="mt-4 flex items-center">
                    {autor && (
                        <Link href={`/autor/${autor.slug}`} className="flex items-center">
                            <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2">
                                <Image
                                    src={autorFoto}
                                    alt={autor.nombre || 'Autor'}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-sm font-medium text-gray-700 hover:text-lilia-primary">
                                {autor.nombre}
                            </span>
                        </Link>
                    )}
                    <span className="mx-2 text-gray-400">•</span>
                    <time className="text-sm text-gray-500">{fechaFormateada}</time>
                </div>
            </div>
        </article>
    );
}
