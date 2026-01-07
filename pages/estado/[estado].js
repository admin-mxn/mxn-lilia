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
import Portada from '../../components/Portada';
import CookieConsent from "react-cookie-consent";
import Link from 'next/link';

import { AdDisplayHorizontal } from '../../components/AdSense';
import Footer from '../../layouts/Footer';
import HomeBanner from '../../components/HomeBanner';
import MiddleBanner from '../../components/MiddleBanner';


const Home = ({ programas, regiones, estado }) => {
  const { user, loading } = useFetchUser();
  const [pageIndex, setPageIndex] = useState(1);
  
  const { data } = useSWR(
    `/programas?&pagination[page]=${pageIndex}&region_estado=${estado}`,
    () => fetchProgramas({ pageParam: pageIndex, region_estado: estado }),
    {
      fallbackData: programas,
    }
  );
 
  //console.log({data})
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
            {/* <PageHeader /> */}
            <Nav />

            <div className='grid grid-cols-[auto,1fr] flex-grow-1 overflow-auto'>
              
                <Sidebar regiones={regiones} />
              <div className='overflow-x-hidden'>
                <HomeBanner />
                
                <div className='sticky top-0 bg-white z-10 '>
                  <BannerApps/>
                  <h1 className='text-3xl font-bold py-4 px-4 md:px-8'>{estado}</h1>
                </div>

                <div className='w-full max-w-6xl mx-auto px-4 md:px-8'>
                  <Portada programa={data[0]} />
                </div>

                <MiddleBanner />
                <Programas programas={data} />
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
  const { estado } = params
  console.log({ estado })
  const programasResponse = await fetchProgramas({ pageParam: 1 , region_estado: estado})

  // const programasResponse = await fetcher(
  //   `${process.env.NEXT_PUBLIC_STRAPI_URL}/programas?populate=*&sort=lanzamiento:DESC&pagination[page]=1&pagination[pageSize]=100&filters[$and][0][region_estado][nombre_completo][$eq]=${estado}`
  // );
  const regionesResponse = await fetcher(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/region-estados?sort=nombre_completo:ASC&pagination[pageSize]=100`
  );
  return {
    props: {
      programas: programasResponse,
      regiones: regionesResponse,
      estado
    },
  };
}
