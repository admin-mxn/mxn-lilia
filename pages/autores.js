import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import NavLilia from '../layouts/NavLilia';
import Footer from '../layouts/Footer';
import { UserProvider, useFetchUser } from '../lib/authContext';
import { fetchAutores } from '../actions/fetch-autores';

const AutoresPage = ({ autores }) => {
    const { user, loading } = useFetchUser();

    return (
        <UserProvider value={{ user, loading }}>
            <Head>
                <title>Autores | Lilia</title>
                <meta name="description" content="Nuestros columnistas y colaboradores" />
            </Head>

            <div className="min-h-screen flex flex-col bg-gray-50">
                <NavLilia />

                <main className="flex-1">
                    {/* Header */}
                    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
                        <div className="max-w-4xl mx-auto px-4 text-center">
                            <h1 className="text-4xl font-bold">Autores</h1>
                            <p className="mt-2 text-blue-100 text-lg">
                                Nuestros columnistas y colaboradores
                            </p>
                        </div>
                    </header>

                    {/* Lista de autores */}
                    <section className="max-w-4xl mx-auto px-4 py-8">
                        {autores && autores.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {autores.map((autor) => {
                                    const attrs = autor.attributes || autor;
                                    const fotoUrl = attrs.foto?.data?.attributes?.url || attrs.foto?.url;
                                    const columnas = attrs.columnas?.data || attrs.columnas || [];

                                    return (
                                        <Link
                                            key={autor.id}
                                            href={`/autor/${attrs.slug}`}
                                            className="block bg-white border border-gray-200 shadow-sm hover:shadow-lg transition text-center p-6"
                                        >
                                            {/* Foto del autor */}
                                            <div className="w-36 h-36 mx-auto bg-white p-2 rounded-tl-3xl rounded-br-3xl" style={{ border: '3px solid #BBBBBB' }}>
                                                <div className="relative w-full h-full overflow-hidden rounded-tl-2xl rounded-br-2xl">
                                                    {fotoUrl ? (
                                                        <Image
                                                            src={fotoUrl}
                                                            alt={attrs.nombre}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl text-gray-400">
                                                            {attrs.nombre?.charAt(0) || '?'}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <h2 className="mt-4 text-lg font-bold text-gray-900">
                                                {attrs.nombre}
                                            </h2>

                                            {attrs.bio && (
                                                <p className="mt-2 text-gray-500 text-sm line-clamp-2">
                                                    {attrs.bio}
                                                </p>
                                            )}

                                            <p className="mt-4 text-sm text-blue-500 font-medium">
                                                {columnas.length} columna{columnas.length !== 1 ? 's' : ''}
                                            </p>

                                            {/* Redes sociales */}
                                            <div className="mt-3 flex justify-center gap-3 text-gray-400">
                                                {attrs.twitter_x && (
                                                    <span title={`@${attrs.twitter_x.replace('@', '')}`}>𝕏</span>
                                                )}
                                                {attrs.instagram && (
                                                    <span title={`@${attrs.instagram.replace('@', '')}`}>📷</span>
                                                )}
                                                {attrs.url_sitio && (
                                                    <span title="Sitio web">🌐</span>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-12">
                                No hay autores disponibles.
                            </p>
                        )}
                    </section>
                </main>

                <Footer />
            </div>
        </UserProvider>
    );
};

export default AutoresPage;

export async function getServerSideProps() {
    const autores = await fetchAutores();

    return {
        props: {
            autores: autores || [],
        },
    };
}
