import { Html, Head, Main, NextScript } from 'next/document';
import { AdSense } from '../components/AdSense';
import { GTMnoscript } from '../components/GTM';

export default function Document() {
  return (
    <Html >
      <Head>
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
