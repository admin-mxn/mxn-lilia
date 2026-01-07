import '../styles/globals.css'
import Script from "next/script";
import { GTMscript } from '../components/GTM';
import "@fontsource/staatliches";
import "@fontsource-variable/open-sans";
import React, { useEffect } from 'react';
import { useRouter, Router } from 'next/router';
// import { Adsense } from '../components/AdSense';
import { AdSense, AdSensePush } from '../components/AdSense';
function MyApp({ Component, pageProps }) {
  // const router = useRouter();
  //   const pageView = (id) => {
  //       window && window.dataLayer && window.dataLayer.push({
  //           'event': 'contentView',
  //           'content_id': id
  //       });
  //   }
  //   useEffect(() => {
  //       const handleRouteChange = (url) => {
  //           pageView(pageProps.programa.data[0].id);
  //       };
  //       Router.events.on('routeChangeComplete', handleRouteChange);
  //       return () => {
  //           Router.events.off('routeChangeComplete', handleRouteChange);
  //       };
  //   }, []);
  // useEffect(() => {
  //   dataLayer.push({
  //     user_id: "1234569",
  //   });
  // }, []);

  return (
    <>


      <AdSense />
      <Script strategy='beforeInteractive' type="module" src='https://unpkg.com/media-playlist@0.1'> </Script>

      <Component {...pageProps} />
      <GTMscript />
      {/* <AdSensePush /> */}

    </>
  )
}

export default MyApp
