import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import NavLilia from '../../layouts/NavLilia';
import Footer from '../../layouts/Footer';
import { UserProvider, useFetchUser } from '../../lib/authContext';
import { fetchAutorBySlug } from '../../actions/fetch-autores';
import HomeBanner from '../../components/HomeBanner';
import MiddleBanner from '../../components/MiddleBanner';
import { colors } from '../../lib/styles';

const AutorPage = ({ autor }) => {
    const { user, loading } = useFetchUser();

    if (!autor) {
        return (
            <UserProvider value={{ user, loading }}>
                <div className="min-h-screen flex flex-col bg-gray-50">
                    <NavLilia back />
                    <main className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-gray-900">Autor no encontrado</h1>
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

    const attrs = autor.attributes || autor;
    const { nombre, bio, email, url_sitio, instagram, twitter_x, foto, columnas } = attrs;
    
    const fotoUrl = foto?.data?.attributes?.url || foto?.url;
    const columnasList = columnas?.data || columnas || [];

    return (
        <UserProvider value={{ user, loading }}>
            <Head>
                <title>{nombre} | Lilia</title>
                <meta name="description" content={bio || `Perfil de ${nombre}`} />
            </Head>

            <div className="min-h-screen flex flex-col bg-gray-50">
                <NavLilia back />

                {/* Banner superior */}
                <HomeBanner />

                <main className="flex-1">
                    {/* Header del autor */}
                    <header className="text-white" style={{ background: `linear-gradient(to right, ${colors.accent}, #3B82F6)` }}>
                        <div className="max-w-4xl mx-auto px-4 py-12">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                {/* Foto del autor */}
                                <div className="flex-shrink-0">
                                    <div className="w-48 h-48 bg-white p-2 rounded-tl-[3rem] rounded-br-[3rem] shadow-lg" style={{ border: '5px solid #BBBBBB' }}>
                                        <div className="relative w-full h-full overflow-hidden rounded-tl-[2.5rem] rounded-br-[2.5rem]">
                                            {fotoUrl ? (
                                                <Image
                                                    src={fotoUrl}
                                                    alt={nombre}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-blue-400 flex items-center justify-center text-6xl">
                                                    {nombre?.charAt(0) || '?'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <p className="mt-3 text-center text-xl font-semibold italic text-white/90">
                                        {nombre}
                                    </p>
                                </div>

                                {/* Info del autor */}
                                <div className="flex-1 text-center md:text-left">
                                    {bio && (
                                        <p className="text-white/80 text-lg leading-relaxed">
                                            {bio}
                                        </p>
                                    )}

                                    {/* Datos de contacto */}
                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {url_sitio && (
                                            <a 
                                                href={url_sitio} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="px-3 py-1 rounded-bl-lg rounded-tr-lg text-white hover:opacity-80 transition"
                                                style={{ backgroundColor: colors.border }}
                                            >
                                                🌐 {url_sitio.replace('https://', '').replace('http://', '')}
                                            </a>
                                        )}
                                        {email && (
                                            <a 
                                                href={`mailto:${email}`} 
                                                className="px-3 py-1 rounded-bl-lg rounded-tr-lg text-white hover:opacity-80 transition"
                                                style={{ backgroundColor: colors.border }}
                                            >
                                                ✉️ {email}
                                            </a>
                                        )}
                                        {twitter_x && (
                                            <a 
                                                href={`https://twitter.com/${twitter_x.replace('@', '')}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="px-3 py-1 rounded-bl-lg rounded-tr-lg text-white hover:opacity-80 transition"
                                                style={{ backgroundColor: colors.border }}
                                            >
                                                𝕏 @{twitter_x.replace('@', '')}
                                            </a>
                                        )}
                                        {instagram && (
                                            <a 
                                                href={`https://instagram.com/${instagram.replace('@', '')}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="px-3 py-1 rounded-bl-lg rounded-tr-lg text-white hover:opacity-80 transition"
                                                style={{ backgroundColor: colors.border }}
                                            >
                                                📷 @{instagram.replace('@', '')}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Banner medio */}
                    <MiddleBanner />

                    {/* Columnas del autor */}
                    <section className="max-w-4xl mx-auto px-4 py-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Columnas de {nombre}
                        </h2>

                        {columnasList.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {columnasList.map((columna) => {
                                    const colAttrs = columna.attributes || columna;
                                    const articulos = colAttrs.articulos?.data || colAttrs.articulos || [];
                                    
                                    return (
                                        <Link 
                                            key={columna.id} 
                                            href={`/columna/${colAttrs.slug}`}
                                            className="block bg-white border border-gray-200 shadow-sm hover:shadow-md transition p-6"
                                        >
                                            <h3 className="text-xl font-bold text-gray-900" style={{ ':hover': { color: colors.accent } }}>
                                                {colAttrs.nombre}
                                            </h3>
                                            {colAttrs.descripcion && (
                                                <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                                                    {colAttrs.descripcion}
                                                </p>
                                            )}
                                            <p className="mt-4 text-sm" style={{ color: colors.accent }}>
                                                {articulos.length} artículo{articulos.length !== 1 ? 's' : ''}
                                            </p>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-12">
                                Este autor aún no tiene columnas.
                            </p>
                        )}
                    </section>
                </main>

                <Footer />
            </div>
        </UserProvider>
    );
};

export default AutorPage;

export async function getServerSideProps({ params }) {
    const autor = await fetchAutorBySlug(params.slug);

    return {
        props: {
            autor,
        },
    };
}
