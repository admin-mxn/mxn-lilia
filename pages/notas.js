import Head from 'next/head';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Newsletter from '../components/Newsletter';
import { fetcher } from '../lib/api';

export default function NotasPage({ regiones }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar estadísticas al montar la página
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Obtener estadísticas básicas
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/newsletter-notas?pagination[pageSize]=1&fields=id`);
      const totalResponse = await response.json();
      
      const seccionesResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/newsletter-notas?fields=seccion&pagination[pageSize]=1000`);
      const seccionesData = await seccionesResponse.json();
      
      const verificadasResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/newsletter-notas?filters[verificado][$eq]=true&pagination[pageSize]=1&fields=id`);
      const verificadasData = await verificadasResponse.json();
      
      const autoresResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/newsletter-notas?fields=autor&pagination[pageSize]=1000`);
      const autoresData = await autoresResponse.json();
      
      const uniqueAutores = [...new Set(
        autoresData.data
          .map(item => item.attributes.autor)
          .filter(autor => autor && autor.trim() !== '')
      )];
      
      const uniqueSecciones = [...new Set(
        seccionesData.data
          .map(item => item.attributes.seccion)
          .filter(seccion => seccion && seccion.trim() !== '')
      )];

      setStats({
        totalNotas: totalResponse.meta.pagination.total,
        seccionesActivas: uniqueSecciones.length,
        notasVerificadas: verificadasData.meta.pagination.total,
        autoresUnicos: uniqueAutores.length
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Formatear números
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num?.toString() || '0';
  };

  return (
    <>
      <Head>
        <title>Newsletter MXN - Noticias Verificadas | Portal MXN</title>
        <meta 
          name="description" 
          content="Accede a las noticias más relevantes procesadas automáticamente desde nuestros newsletters diarios. Información verificada de política, economía, sociedad y más." 
        />
        <meta name="keywords" content="newsletter, noticias MXN, política México, economía mexicana, noticias verificadas, actualidad México" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Newsletter MXN - Noticias Verificadas" />
        <meta property="og:description" content="Las noticias más relevantes procesadas desde nuestros newsletters diarios" />
        <meta property="og:url" content="https://portal.mxn.group/notas" />
        <meta property="og:site_name" content="Portal MXN" />
        <meta property="og:image" content="https://portal.mxn.group/images/newsletter-og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="es_MX" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Newsletter MXN - Noticias Verificadas" />
        <meta name="twitter:description" content="Las noticias más relevantes procesadas desde nuestros newsletters diarios" />
        <meta name="twitter:image" content="https://portal.mxn.group/images/newsletter-og.jpg" />
        <meta name="twitter:site" content="@MXNGroup" />
        <meta name="twitter:creator" content="@MXNGroup" />

        {/* Additional SEO tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="MXN Group" />
        <meta name="publisher" content="MXN Group" />
        <meta name="copyright" content="© 2024 MXN Group" />
        <meta name="language" content="es-MX" />
        <meta name="revisit-after" content="1 day" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://portal.mxn.group/notas" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Newsletter MXN - Noticias Verificadas",
              "description": "Accede a las noticias más relevantes procesadas automáticamente desde nuestros newsletters diarios",
              "url": "https://portal.mxn.group/notas",
              "mainEntity": {
                "@type": "ItemList",
                "name": "Noticias del Newsletter MXN",
                "description": "Colección de noticias verificadas procesadas desde newsletters",
                "publisher": {
                  "@type": "Organization",
                  "name": "MXN Group",
                  "url": "https://mxn.group"
                }
              },
              "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Inicio",
                    "item": "https://portal.mxn.group"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Newsletter",
                    "item": "https://portal.mxn.group/notas"
                  }
                ]
              }
            })
          }}
        />
      </Head>

      {/* Banner de estadísticas */}
      {!loading && stats && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold">
                  {formatNumber(stats.totalNotas)}
                </div>
                <div className="text-blue-100 text-sm">
                  Notas procesadas
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold">
                  {stats.seccionesActivas || 0}
                </div>
                <div className="text-blue-100 text-sm">
                  Secciones
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold">
                  {stats.notasVerificadas || 0}
                </div>
                <div className="text-blue-100 text-sm">
                  Verificadas
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold">
                  {stats.autoresUnicos || 0}
                </div>
                <div className="text-blue-100 text-sm">
                  Autores
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Layout regiones={regiones}>
        {/* Componente principal del newsletter */}
        <Newsletter />
      </Layout>

      {/* Footer informativo */}
      <div className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Copyright */}
          <div className="text-center text-gray-400 text-sm">
            <p className="mt-1">
              Las noticias son procesadas automáticamente y pueden contener errores. 
              Consulta las fuentes originales para información completa.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const regionesResponse = await fetcher(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/region-estados?sort=nombre_completo:ASC&pagination[pageSize]=100`
  );
  return {
    props: {
      regiones: regionesResponse,
    },
  };
}