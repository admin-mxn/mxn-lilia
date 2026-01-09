import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import NavLilia from '../layouts/NavLilia';
import Footer from '../layouts/Footer';
import { UserProvider, useFetchUser } from '../lib/authContext';
import { fetchColumnas } from '../actions/fetch-columnas';

const ColumnasPage = ({ columnas }) => {
    const { user, loading } = useFetchUser();

    return (
        <UserProvider value={{ user, loading }}>
            <Head>
                <title>Columnas | Lilia</title>
                <meta name="description" content="Todas las columnas de opinión" />
            </Head>

            <div className="min-h-screen flex flex-col bg-gray-50">
                <NavLilia />

                <main className="flex-1">
                    {/* Header */}
                    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
                        <div className="max-w-4xl mx-auto px-4 text-center">
                            <h1 className="text-4xl font-bold">Columnas</h1>
                            <p className="mt-2 text-blue-100 text-lg">
                                Opinión y análisis de nuestros colaboradores
                            </p>
                        </div>
                    </header>

                    {/* Lista de columnas */}
                    <section className="max-w-4xl mx-auto px-4 py-8">
                        {columnas && columnas.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {columnas.map((columna) => {
                                    const attrs = columna.attributes || columna;
                                    const autor = attrs.autor?.data?.attributes || attrs.autor;
                                    const fotoUrl = autor?.foto?.data?.attributes?.url || autor?.foto?.url;
                                    const articulos = attrs.articulos?.data || attrs.articulos || [];

                                    return (
                                        <Link
                                            key={columna.id}
                                            href={`/columna/${attrs.slug}`}
                                            className="block bg-white border border-gray-200 shadow-sm hover:shadow-lg transition overflow-hidden"
                                        >
                                            {/* Imagen de columna si existe */}
                                            {attrs.imagen?.data?.attributes?.url && (
                                                <div className="relative h-40 bg-gray-200">
                                                    <Image
                                                        src={attrs.imagen.data.attributes.url}
                                                        alt={attrs.nombre}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}

                                            <div className="p-6">
                                                <div className="flex items-center gap-4 mb-4">
                                                    {/* Foto del autor */}
                                                    <div className="w-16 h-16 flex-shrink-0 bg-white p-1 rounded-tl-2xl rounded-br-2xl" style={{ border: '3px solid #BBBBBB' }}>
                                                        <div className="relative w-full h-full overflow-hidden rounded-tl-xl rounded-br-xl">
                                                            {fotoUrl ? (
                                                                <Image
                                                                    src={fotoUrl}
                                                                    alt={autor?.nombre || 'Autor'}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                                                                    ?
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h2 className="text-xl font-bold text-gray-900">
                                                            {attrs.nombre}
                                                        </h2>
                                                        {autor?.nombre && (
                                                            <p className="text-sm text-gray-500">
                                                                por {autor.nombre}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {attrs.descripcion && (
                                                    <p className="text-gray-600 text-sm line-clamp-2">
                                                        {attrs.descripcion}
                                                    </p>
                                                )}

                                                <p className="mt-4 text-sm text-blue-500 font-medium">
                                                    {articulos.length} artículo{articulos.length !== 1 ? 's' : ''} →
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-12">
                                No hay columnas disponibles.
                            </p>
                        )}
                    </section>
                </main>

                <Footer />
            </div>
        </UserProvider>
    );
};

export default ColumnasPage;

export async function getServerSideProps() {
    const columnas = await fetchColumnas();

    return {
        props: {
            columnas: columnas || [],
        },
    };
}
