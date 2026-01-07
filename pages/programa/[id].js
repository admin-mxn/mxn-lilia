import Script from "next/script";

import { fetcher } from '../../lib/api';
// import { UserProvider } from '../lib/authContext';
import { SidebarProvider } from "../../contexts/SidebarContext"
import { fetchProgramas } from '../../actions/fetch-programas';

import Head from 'next/head';
import Nav from '../../layouts/Nav';
import Sidebar from '../../layouts/Sidebar';

import MuxPlayer from "@mux/mux-player-react";
import BannerApps from '../../layouts/BannerApps';
import Programas from '../../components/Programas';
import StickyPlayer from '../../components/StickyPlayer';
import { useEffect } from "react";
import Link from 'next/link';

import CookieConsent from "react-cookie-consent";
import { AdInArticle1 } from "../../components/AdSense";
import HomeBanner from '../../components/HomeBanner';
import MiddleBanner from '../../components/MiddleBanner';
import Footer from '../../layouts/Footer';

const Programa = ({ programa, jwt, plot, error, regiones, programas, mi_estado, mi_seccion, programasPorSeccion }) => {

  // window && window.dataLayer && window.dataLayer.push({
  //     'event': 'virtualPageview',
  //     'virtualPageURL': url,
  //     'virtualPageTitle': title,
  // })
  let misVideos = { data: Array };

  misVideos.data = [programa.data[0]]
  // useEffect(() => {
  //   console.log("useEffect")
  //   console.log(misVideos.data[0].id)
  //   window.dataLayer = window.dataLayer || [];
  //   function gtag() {
  //     dataLayer.push(arguments);
  //   }
  //   gtag("js", new Date());
  //   dataLayer.push({
  //     content_id: misVideos.data[0].id,
  //   });
  // }, []);
  return (
    <>
      <SidebarProvider>
        <Head>
          <title>Informativo MXN - {misVideos.data[0].attributes.region_estado.data.attributes.nombre_completo} - {misVideos.data[0].attributes.lanzamiento}</title>
          <meta name="description" content={misVideos.data[0].attributes.sintesis} />
          <meta property="og:title" content={misVideos.data[0].attributes.titulo} />
          <meta property="og:description" content={misVideos.data[0].attributes.sintesis} />
          <meta property="og:url" content={`https://informativomxn.com/programa/${misVideos.data[0].id}`} />
          <meta property="og:type" content="video" />
          <meta property="og:video" content={`https://stream.mux.com/${misVideos.data[0].attributes.video_pral.data.attributes.playback_id}.m3u8`} />
          <meta property="og:video:secure_url" content={`https://stream.mux.com/${misVideos.data[0].attributes.video_pral.data.attributes.playback_id}.m3u8`} />
          <meta property="og:video:type" content="application/x-mpegURL" />
          <meta property="og:video:width" content="1920" />
          <meta property="og:video:height" content="1080" />
          <meta property="og:video:tag" content={misVideos.data[0].attributes.titulo} />
          <meta property="og:video:tag" content={misVideos.data[0].attributes.region_estado.data.attributes.nombre_completo} />
          <meta property="og:video:tag" content={misVideos.data[0].attributes.lanzamiento} />
          <meta property="og:video:tag" content={misVideos.data[0].attributes.sintesis} />
          <meta property="og:video:tag" content={misVideos.data[0].attributes.secciones} />
          <meta property="og:video:tag" content={misVideos.data[0].attributes.region_estado.data.attributes.nombre_completo} />
          {/* <meta property="og:image" content={misVideos.data[0].attributes.imagen.url} /> */}

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
              <div className='sticky top-0 z-10'>
                <BannerApps />
              </div>

              {/* Banner superior */}
              <HomeBanner />

              {/* Video player con límite de ancho y sticky */}
              <div className='w-full max-w-6xl mx-auto px-4 md:px-8 mt-4'>
                <StickyPlayer
                  playbackId={misVideos.data[0].attributes.video_pral.data.attributes.playback_id}
                  metadata={{
                    video_id: misVideos.data[0].attributes.video_pral.data.attributes.playback_id,
                    video_title: misVideos.data[0].attributes.titulo,
                    viewer_user_id: "user-id-007",
                  }}
                  title={misVideos.data[0].attributes.region_estado.data.attributes.nombre_completo}
                  subtitle={misVideos.data[0].attributes.lanzamiento}
                />
                <div className='mt-6 gap-4 flex items-baseline'>
                  <div className='text-4xl font-staatliches'>{misVideos.data[0].attributes.region_estado.data.attributes.nombre_completo}</div>
                  <div className='text-xl text-bold'>{misVideos.data[0].attributes.lanzamiento}</div>
                </div>
                {/* <h1 className='text-2xl font-bold '>{misVideos.data[0].attributes.titulo}</h1> */}
                <p className='mt-4 md:text-lg'>{misVideos.data[0].attributes.sintesis}</p>
              </div>

              {/* Banner inferior */}
              <MiddleBanner />

              {/* AdSense comentado */}
              {/* <AdInArticle1 /> */}
            
              {/* Grid de más videos con límite de ancho */}
              <div className='w-full bg-zinc-100'>
                <div className='max-w-7xl mx-auto px-4 md:px-8 py-8'>
                  <h2 className='text-2xl font-bold mb-4'>Más videos de {mi_estado}</h2>
                  <Programas programas={programas} />
                  {mi_seccion ? <h2 className='text-2xl font-bold mt-8 mb-4'>Más videos de {mi_seccion}</h2> : null}
                  <Programas programas={programasPorSeccion} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer con banner */}
          <Footer />
        </div>
        {/* </UserProvider> */}
      </SidebarProvider>
    </>
  )
};

export async function getServerSideProps({ req, params }) {
  const { id } = params;
  const jwt = ""
  //console.log({id})
  // const jwt =
  //   typeof window !== 'undefined'
  //     ? getTokenFromLocalCookie
  //     : getTokenFromServerCookie(req);
  //console.log(`${process.env.NEXT_PUBLIC_STRAPI_URL}/programas/${id}?populate=*`)

  const regionesResponse = await fetcher(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/region-estados?sort=nombre_completo:ASC&pagination[pageSize]=100`
  );
  console.log(regionesResponse)
  const programaResponse = await fetcher(
    //`${process.env.NEXT_PUBLIC_STRAPI_URL}/slugify/slugs/film/${slug}?populate=*`,
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/programas/${id}?populate=*`,
    jwt
      ? {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
      : ''
  );
  const estado = programaResponse.data.attributes.region_estado.data.attributes.nombre_completo
  const seccion = programaResponse.data.attributes.secciones
  console.log({ estado })
  console.log({ seccion })
  const programasResponse = await fetchProgramas({ pageParam: 1, region_estado: estado })

  const programasPorSeccionResponse = seccion ? await fetchProgramas({ pageParam: 1, seccion: seccion }) : null




  if (programaResponse.data) {
    //const plot = await markdownToHtml(filmResponse.data.attributes.plot);
    // console.log({data: programaResponse.data })
    // console.log({secciones: programaResponse.data.attributes.secciones })
    // console.log({region_estado: programaResponse.data.attributes.region_estado.data.attributes.nombre_completo })
    return {
      props: {
        programa: { data: [programaResponse.data] },
        //  plot,
        jwt: jwt ? jwt : '',
        mi_estado: estado,
        mi_seccion: seccion,
        regiones: regionesResponse,
        programas: programasResponse,
        programasPorSeccion: programasPorSeccionResponse
      },
    };
  } else {
    console.log("error")
    // console.log(programaResponse.error)
    return {
      props: {
        error: programaResponse.error.message

      },
    };
  }
}

export default Programa;
