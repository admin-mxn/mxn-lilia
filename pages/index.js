import { fetcher } from '../lib/api';
import useSWR from 'swr';
import { useState } from 'react';
import { useFetchUser } from '../lib/authContext';
import Link from 'next/link';
import Head from 'next/head';
import NavLilia from '../layouts/NavLilia';
import { UserProvider } from '../lib/authContext';
import Footer from '../layouts/Footer';
import { fetchArticulos } from '../actions/fetch-articulos';
import { fetchColumnas } from '../actions/fetch-columnas';
import ArticulosGrid from '../components/ArticulosGrid';
import HomeBanner from '../components/HomeBanner';
import MiddleBanner from '../components/MiddleBanner';
import CookieConsent from "react-cookie-consent";
import { colors } from '../lib/styles';

const Home = ({ articulos, columnas }) => {
  const { user, loading } = useFetchUser();
  const [pageIndex, setPageIndex] = useState(1);

  // Para páginas adicionales
  const { data: moreArticulos } = useSWR(
    pageIndex > 1 ? `/articulos?pagination[page]=${pageIndex}` : null,
    () => fetchArticulos({ pageParam: pageIndex }),
    { fallbackData: [] }
  );

  const allArticulos = pageIndex === 1 ? articulos : [...articulos, ...moreArticulos];

  return (
    <>
      <UserProvider value={{ user, loading }}>
        <Head>
          <title>Lilia - Portal de Columnas</title>
          <meta name="description" content="Portal de columnas y opinión" />
        </Head>
        
        <CookieConsent
          location="bottom"
          buttonText="Aceptar"
          style={{ background: "#333", color: "#fff", fontSize: "13px" }}
          buttonStyle={{ background: "#8B5CF6", color: "#fff", fontSize: "13px" }}
          expires={150}
        >
          Utilizamos cookies para mejorar su experiencia. Al continuar navegando, acepta el uso de cookies de acuerdo con nuestra{' '}
          <Link className="font-bold hover:underline" href="/politicaprivacidad">
            Política de Privacidad.
          </Link>
        </CookieConsent>

        <div className="min-h-screen flex flex-col bg-gray-50">
          <NavLilia />

          {/* Banner superior */}
          <HomeBanner />

          <main className="flex-1">
            {/* Hero / Columnas destacadas */}
            {columnas && columnas.length > 0 && (
              <section className="bg-white py-8 border-b">
                <div className="max-w-6xl mx-auto px-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Columnas Destacadas</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {columnas.slice(0, 3).map((columna) => {
                      const attrs = columna.attributes || columna;
                      const autor = attrs.autor?.data?.attributes || attrs.autor;
                      return (
                        <Link 
                          key={columna.id} 
                          href={`/columna/${attrs.slug}`}
                          className="p-4 bg-gradient-to-br from-lilia-primary to-lilia-secondary rounded-lg text-white hover:opacity-90 transition"
                        >
                          <h3 className="text-lg font-bold">{attrs.nombre}</h3>
                          {autor && <p className="text-sm opacity-80">por {autor.nombre}</p>}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* Banner medio */}
            <MiddleBanner />

            {/* Grid de artículos */}
            <div className="max-w-6xl mx-auto">
              <ArticulosGrid articulos={allArticulos} titulo="Últimos Artículos" />
              
              {/* Load More Button */}
              <div className="text-center py-8">
                <button
                  onClick={() => setPageIndex(pageIndex + 1)}
                  className="px-6 py-3 text-white rounded-lg hover:opacity-80 transition"
                  style={{ backgroundColor: colors.accent }}
                >
                  Cargar más artículos
                </button>
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </UserProvider>
    </>
  );
};

export default Home;

export async function getServerSideProps() {
  const articulos = await fetchArticulos({ pageParam: 1 });
  const columnas = await fetchColumnas({ destacadas: true });
  
  return {
    props: {
      articulos,
      columnas,
    },
  };
}
