import Programas from '../../components/Programas';
import { fetcher } from '../../lib/api';
import useSWR from 'swr';
import { useState } from 'react';
import { useFetchUser } from '../../lib/authContext';
import { fetchProgramas } from '../../actions/fetch-programas';

import Head from 'next/head';
import Nav from '../../layouts/Nav';
import { UserProvider } from '../../lib/authContext';
import Sidebar from '../../layouts/Sidebar';
// import { PageHeader } from '../layouts/PageHeader';
import { SidebarProvider } from "../../contexts/SidebarContext"
import BannerApps from '../../layouts/BannerApps';
import Banner from '../../layouts/Banner';
import Portada from '../../components/Portada';
import Image from 'next/image';
import Link from 'next/link';
import CookieConsent from "react-cookie-consent";

import { AdDisplayHorizontal } from '../../components/AdSense';
import Footer from '../../layouts/Footer';
import HomeBanner from '../../components/HomeBanner';
import MiddleBanner from '../../components/MiddleBanner';


const Home = ({ programas, regiones, seccion, banners }) => {
  const { user, loading } = useFetchUser();
  const [pageIndex, setPageIndex] = useState(1);
  const { data } = useSWR(
    `/programas?&pagination[page]=${pageIndex}&seccion=${seccion}`,
    () => fetchProgramas({ pageParam: pageIndex, seccion: seccion }),
    {
      fallbackData: programas,
    }
  );


  // const { top_1, bottom_1, bottom_2 } = banners.data.attributes
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
            buttonStyle={{ background:"#ff0000", color:"#fff",  fontSize: "13px" }}
            expires={150}
          >
            En InformativoMXN, utilizamos cookies para mejorar su experiencia en nuestro sitio web. Al continuar navegando en nuestro sitio, acepta el uso de cookies de acuerdo con nuestra <Link className=' font-bold hover:underline' href="/politicaprivacidad">Política de Privacidad.</Link>
          </CookieConsent>
          <div className="max-h-screen flex flex-col">
            <Nav />
            <div className='grid grid-cols-[auto,1fr] flex-grow-1 overflow-auto'>

              <Sidebar regiones={regiones} />

              <div className='overflow-x-hidden'>
                <HomeBanner />
                
                <div className='sticky top-0 bg-white z-10'>
                  <BannerApps />
                  <h1 className='text-3xl font-bold py-4 px-4 md:px-8'>{seccion}</h1>
                </div>

                {
                  data && data.length === 0 ?
                    <h1 className='px-4 md:px-8'>No hay programas en esta sección</h1>
                    :
                    <>
                      <div className='w-full max-w-6xl mx-auto px-4 md:px-8'>
                        <Portada programa={data[0]} />
                      </div>

                      <MiddleBanner />
                      
                      <Programas programas={data} seccion={seccion} />
                    </>
                }
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

export async function getServerSideProps({ req, params }) {
  const { seccion } = params
  // console.log({ seccion })
  const programasResponse = await fetchProgramas({ pageParam: 1, seccion: seccion })

  const regionesResponse = await fetcher(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/region-estados?sort=nombre_completo:ASC&pagination[pageSize]=100`
  );
  const bannersResponse = await fetcher(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/banners-layout?populate[top_1][populate]=*&populate[bottom_1][populate]=*&populate[bottom_2][populate]=*`
  );
  return {
    props: {
      programas: programasResponse,
      regiones: regionesResponse,
      seccion: seccion,
      banners: bannersResponse
    },
  };
}
