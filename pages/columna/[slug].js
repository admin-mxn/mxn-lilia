import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import NavLilia from '../../layouts/NavLilia';
import Footer from '../../layouts/Footer';
import { UserProvider, useFetchUser } from '../../lib/authContext';
import { fetchColumnaBySlug } from '../../actions/fetch-columnas';
import ArticuloCard from '../../components/ArticuloCard';
import HomeBanner from '../../components/HomeBanner';
import MiddleBanner from '../../components/MiddleBanner';
import { colors } from '../../lib/styles';

const ColumnaPage = ({ columna }) => {
    const { user, loading } = useFetchUser();

    if (!columna) {
        return (
            <UserProvider value={{ user, loading }}>
                <div className="min-h-screen flex flex-col bg-gray-50">
                    <NavLilia back />
                    <main className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-gray-900">Columna no encontrada</h1>
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

    const attrs = columna.attributes || columna;
    const { nombre, descripcion, imagen, articulos } = attrs;
    const autor = attrs.autor?.data?.attributes || attrs.autor;
    
    const imagenUrl = imagen?.data?.attributes?.url || imagen?.url;
    const autorFoto = autor?.foto?.data?.attributes?.url || autor?.foto?.url;
    
    // Obtener artículos de la columna
    const articulosList = articulos?.data || articulos || [];

    return (
        <UserProvider value={{ user, loading }}>
            <Head>
                <title>{nombre} | Lilia</title>
                <meta name="description" content={descripcion || `Columna ${nombre}`} />
            </Head>

            <div className="min-h-screen flex flex-col bg-gray-50">
                <NavLilia back />

                {/* Banner superior */}
                <HomeBanner />

                <main className="flex-1">
                    {/* Header de la columna */}
                    <header className="text-white" style={{ background: `linear-gradient(to right, ${colors.accent}, #3B82F6)` }}>
                        <div className="max-w-4xl mx-auto px-4 py-12">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                {/* Foto del autor */}
                                {autor && (
                                    <Link href={`/autor/${autor.slug}`} className="flex-shrink-0">
                                        <div className="w-40 h-40 bg-white p-1.5 rounded-tl-[2rem] rounded-br-[2rem] shadow-lg" style={{ border: '4px solid #BBBBBB' }}>
                                            <div className="relative w-full h-full overflow-hidden rounded-tl-[1.5rem] rounded-br-[1.5rem]">
                                                {autorFoto ? (
                                                    <Image
                                                        src={autorFoto}
                                                        alt={autor.nombre || 'Autor'}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-blue-400 flex items-center justify-center text-4xl">
                                                        {autor.nombre?.charAt(0) || '?'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                )}

                                {/* Info de la columna */}
                                <div className="text-center md:text-left">
                                    <h1 className="text-3xl md:text-4xl font-bold">{nombre}</h1>
                                    {autor && (
                                        <Link href={`/autor/${autor.slug}`}>
                                            <p className="text-xl text-white/80 mt-2 hover:text-white italic">
                                                por {autor.nombre}
                                            </p>
                                        </Link>
                                    )}
                                    {descripcion && (
                                        <p className="mt-4 text-white/80 max-w-xl">
                                            {descripcion}
                                        </p>
                                    )}

                                    {/* Datos de contacto del autor */}
                                    {autor && (
                                        <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start text-sm">
                                            {autor.url_sitio && (
                                                <a href={autor.url_sitio} target="_blank" rel="noopener noreferrer" 
                                                   className="px-3 py-1 rounded-bl-lg rounded-tr-lg text-white hover:opacity-80 transition"
                                                   style={{ backgroundColor: colors.border }}>
                                                    🌐 {autor.url_sitio.replace('https://', '').replace('http://', '')}
                                                </a>
                                            )}
                                            {autor.email && (
                                                <a href={`mailto:${autor.email}`} 
                                                   className="px-3 py-1 rounded-bl-lg rounded-tr-lg text-white hover:opacity-80 transition"
                                                   style={{ backgroundColor: colors.border }}>
                                                    ✉️ {autor.email}
                                                </a>
                                            )}
                                            {autor.twitter_x && (
                                                <a href={`https://twitter.com/${autor.twitter_x.replace('@', '')}`} target="_blank" rel="noopener noreferrer" 
                                                   className="px-3 py-1 rounded-bl-lg rounded-tr-lg text-white hover:opacity-80 transition"
                                                   style={{ backgroundColor: colors.border }}>
                                                    𝕏 @{autor.twitter_x.replace('@', '')}
                                                </a>
                                            )}
                                            {autor.instagram && (
                                                <a href={`https://instagram.com/${autor.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" 
                                                   className="px-3 py-1 rounded-bl-lg rounded-tr-lg text-white hover:opacity-80 transition"
                                                   style={{ backgroundColor: colors.border }}>
                                                    📷 @{autor.instagram.replace('@', '')}
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Lista de artículos */}
                    {/* Banner medio */}
                    <MiddleBanner />

                    <section className="max-w-4xl mx-auto px-4 py-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Artículos de esta columna
                        </h2>

                        {articulosList.length > 0 ? (
                            <div className="flex flex-col gap-6">
                                {articulosList.map((articulo) => (
                                    <ArticuloCard 
                                        key={articulo.id} 
                                        articulo={articulo}
                                        hideAuthor={true}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-12">
                                Aún no hay artículos en esta columna.
                            </p>
                        )}
                    </section>
                </main>

                <Footer />
            </div>
        </UserProvider>
    );
};

export default ColumnaPage;

export async function getServerSideProps({ params }) {
    const columna = await fetchColumnaBySlug(params.slug);

    return {
        props: {
            columna,
        },
    };
}
