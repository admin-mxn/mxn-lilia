import { Html, Head, Main, NextScript } from 'next/document';
import { AdSense } from '../components/AdSense';
import { GTMnoscript } from '../components/GTM';

export default function Document() {
  return (
    <Html >
      <Head>
        {/* Google Fonts - Oswald para menú tipo Impact */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {/* <AdSense /> */}
      </Head>
      <body className=''>
        <GTMnoscript />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
