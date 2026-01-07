import Programas from '../components/Programas';
import { fetcher } from '../lib/api';
import useSWR from 'swr';
import { useState } from 'react';
import { useFetchUser } from '../lib/authContext';
import Link from 'next/link';
import StickyPlaylist from '../components/StickyPlaylist';
import Script from 'next/script';
import Head from 'next/head';
import Nav from '../layouts/Nav';
import { UserProvider } from '../lib/authContext';
import Sidebar from '../layouts/Sidebar';
import { PageHeader } from '../layouts/PageHeader';
import Footer from '../layouts/Footer';
import { SidebarProvider } from "../contexts/SidebarContext"
import { fetchProgramas } from '../actions/fetch-programas';
import { fetchProgramasConDestacados } from '../actions/fetch-programas-destacados';
import { LoadMore } from '../components/LoadMore';
import BannerApps from '../layouts/BannerApps';
import CookieConsent from "react-cookie-consent";

import { AdDisplayHorizontal, AdFooter } from '../components/AdSense';
import HomeBanner from '../components/HomeBanner';
import MiddleBanner from '../components/MiddleBanner';

const Home = ({ programasData, regiones }) => {
  const { user, loading } = useFetchUser();
  const [pageIndex, setPageIndex] = useState(1);

  // Para páginas adicionales, seguimos usando fetchProgramas normal
  const { data } = useSWR(
    pageIndex > 1 ? `/programas?&pagination[page]=${pageIndex}` : null,
    () => fetchProgramas({ pageParam: pageIndex }),
    {
      fallbackData: [],
    }
  );

  // Combinar primera página (mezclada) con páginas adicionales
  const allProgramas = pageIndex === 1 ? programasData.grid : [...programasData.grid, ...data];


  return (
    <>
      <SidebarProvider>
        <UserProvider value={{ user, loading }}>
          <Head>
            <title>Informativo MXN</title>
          </Head>
          <CookieConsent
            location="bottom"
            buttonText="Aceptar"
            style={{ background: "#333", color: "#fff", fontSize: "13px" }}
            buttonStyle={{ background: "#ff0000", color: "#fff", fontSize: "13px" }}
            expires={150}
          > 
            En Informativo MXN, utilizamos cookies para mejorar su experiencia en nuestro sitio web. Al continuar navegando en nuestro sitio, acepta el uso de cookies de acuerdo con nuestra <Link className=' font-bold hover:underline' href="/politicaprivacidad">Política de Privacidad.</Link>
          </CookieConsent>

          <div className="max-h-screen flex flex-col">
            <Nav />

            <div className='grid grid-cols-[auto,1fr] overflow-auto ' >
              {/* <div className='grid grid-cols-[auto,1fr] overflow-auto ' > */}

              <Sidebar regiones={regiones} />

              <div className='overflow-x-hidden'>
                  {/* <img src="/google-play-badge.png" alt="Logo MXN" /> */}
                  {/* AdSense comentado temporalmente - no funciona siempre */}
                  {/* <AdDisplayHorizontal /> */}
                  <HomeBanner />
             

                <div className='sticky top-0 z-10 '>
                  <BannerApps />
                </div>

                <div className='w-full max-w-6xl mx-auto px-4 md:px-8'>
                  <StickyPlaylist playlist={programasData.playlist} />
                </div>

                  {/* AdSense comentado temporalmente - no funciona siempre */}
                  {/* <AdDisplayHorizontal /> */}
                  <MiddleBanner />

                <Programas programas={allProgramas} />
                <LoadMore />
              </div>
            </div>




          </div>
          <Footer />
        </UserProvider>
      </SidebarProvider>
    </>
  );
};

export default Home;

export async function getServerSideProps() {
  const programasDataResponse = await fetchProgramasConDestacados({ pageParam: 1, pageSize: 100 })
  const regionesResponse = await fetcher(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/region-estados?sort=nombre_completo:ASC&pagination[pageSize]=100`
  );
  return {
    props: {
      programasData: programasDataResponse,
      regiones: regionesResponse,
    },
  };
}
