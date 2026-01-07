import Head from 'next/head';
import Nav from '../layouts/Nav';
import { UserProvider } from '../lib/authContext';
import { SidebarProvider } from "../contexts/SidebarContext";
import { useFetchUser } from '../lib/authContext';
import { fetcher } from '../lib/api';

const Politicas = ({ regiones }) => {
  const { user, loading } = useFetchUser();
  return (
    <>
      <SidebarProvider>
        <UserProvider value={{ user, loading }}>
          <Head>
            <title>Informativo MXN</title>
          </Head>
          <div className="max-h-screen flex flex-col">
            <Nav />
            <div className="grid grid-cols-[auto,1fr] flex-grow overflow-auto">
              {/* Si deseas usar el Sidebar, descomenta la siguiente línea */}
              {/* <Sidebar regiones={regiones} /> */}
              <div className="overflow-x-hidden px-8 pb-4">
                <div className="sticky top-0 bg-white z-10 pb-4">
                  <h1 className="text-3xl font-bold">Política de Privacidad</h1>
                </div>
                <main className="bg-white">
                  <div className="space-y-8 py-8">
                    {/* Encabezado */}
                    <div className="space-y-2">
                      <p className="text-xl font-bold">
                       
                          INFORMATIVO MXN
                       
                      </p>
                      <p className="text-lg font-semibold">Aviso de Privacidad</p>
                      <p className="text-sm text-gray-500">
                        Fecha de Última Modificación: 26 de octubre de 2023
                      </p>
                    </div>
                    {/* Sección I */}
                    <section>
                      <h2 className="text-2xl font-bold mt-4">I. Introducción y Alcance</h2>
                      <p className="mt-2 text-gray-700">
                        Informativo MXN es una marca registrada de  <a
                          href="https://informativomayar.com/"
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >Informativo Mayar, SA de CV</a>, una Sociedad Anónima de
                        Capital Variable debidamente constituida conforme a las leyes y reglamentos de la República Mexicana.
                        Valoramos y respetamos la privacidad de nuestros usuarios. Este Aviso de Privacidad define y explica
                        nuestras prácticas en relación con la recopilación, uso y protección de su información personal.
                      </p>
                    </section>
                    {/* Sección II */}
                    <section>
                      <h2 className="text-2xl font-bold mt-4">II. Cómo recopilamos su información</h2>
                      <p className="mt-2 text-gray-700">
                        Recopilamos los siguientes tipos de información personal de usted cuando usa la aplicación:
                      </p>
                      <ul className="list-disc list-inside ml-4 text-gray-700">
                        <li>
                          <strong>Información que nos proporciona:</strong> Cuando se registra para usar la aplicación, nos
                          proporciona su nombre, dirección de correo electrónico y contraseña. También podemos recopilar información
                          adicional sobre usted, como su fecha de nacimiento, ubicación y género, si nos la proporciona.
                        </li>
                        <li>
                          <strong>Información que recopilamos automáticamente:</strong> Al usar la aplicación, recopilamos
                          información sobre su dispositivo (dirección IP, tipo de dispositivo, sistema operativo) y sobre su
                          utilización (noticias leídas, artículos compartidos).
                        </li>
                      </ul>
                    </section>
                    {/* Sección III */}
                    <section>
                      <h2 className="text-2xl font-bold mt-4">III. Cómo usamos su información</h2>
                      <p className="mt-2 text-gray-700">
                        Usamos su información personal para los siguientes fines:
                      </p>
                      <ul className="list-disc list-inside ml-4 text-gray-700">
                        <li>
                          <strong>Proporcionarle la aplicación y sus funciones:</strong> Mostrarle noticias personalizadas y
                          permitirle compartir artículos.
                        </li>
                        <li>
                          <strong>Mejorar la aplicación:</strong> Comprender su uso y desarrollar nuevas funciones.
                        </li>
                        <li>
                          <strong>Enviarle comunicaciones:</strong> Notificaciones de noticias y actualizaciones.
                        </li>
                        <li>
                          <strong>Publicidad:</strong> Mostrarle publicidad relevante.
                        </li>
                      </ul>
                    </section>
                    {/* Sección IV */}
                    <section>
                      <h2 className="text-2xl font-bold mt-4">IV. Acerca de la información que usted nos proporciona</h2>
                      <p className="mt-2 text-gray-700">
                        Podemos compartir su información personal con:
                      </p>
                      <ul className="list-disc list-inside ml-4 text-gray-700">
                        <li>
                          <strong>Proveedores de servicios:</strong> Quienes nos ayudan a proporcionar la aplicación y sus funciones (análisis, marketing, etc.).
                        </li>
                        <li>
                          <strong>Terceros con su consentimiento:</strong> Con quienes usted autorice el intercambio.
                        </li>
                        <li>
                          <strong>Cumplir con la ley:</strong> Para responder a solicitudes de agencias gubernamentales.
                        </li>
                      </ul>
                    </section>
                    {/* Sección V */}
                    <section>
                      <h2 className="text-2xl font-bold mt-4">V. Sus derechos</h2>
                      <p className="mt-2 text-gray-700">
                        Usted tiene los siguientes derechos respecto a su información personal:
                      </p>
                      <ul className="list-disc list-inside ml-4 text-gray-700">
                        <li>
                          <strong>Acceso:</strong> Conocer la información que tenemos de usted.
                        </li>
                        <li>
                          <strong>Rectificación:</strong> Corregir datos inexactos.
                        </li>
                        <li>
                          <strong>Supresión:</strong> Solicitar la eliminación de su información.
                        </li>
                        <li>
                          <strong>Oposición:</strong> Oponerse al tratamiento de su información.
                        </li>
                        <li>
                          <strong>Portabilidad:</strong> Obtener una copia de su información en un formato legible.
                        </li>
                      </ul>
                      <p className="mt-2 text-gray-700">
                        Para ejercer estos derechos, póngase en contacto con nosotros utilizando la información que se detalla a continuación.
                      </p>
                    </section>
                    {/* Sección VI */}
                    <section>
                      <h2 className="text-2xl font-bold mt-4">VI. Cookies y otras tecnologías de seguimiento</h2>
                      <p className="mt-2 text-gray-700">
                        La aplicación utiliza cookies y otras tecnologías de seguimiento para recopilar información sobre su uso.
                        Para mayor información, consulte nuestra política de cookies.
                      </p>
                    </section>
                    {/* Sección VII */}
                    <section>
                      <h2 className="text-2xl font-bold mt-4">VII. Seguridad de su información personal</h2>
                      <p className="mt-2 text-gray-700">
                        Implementamos medidas de seguridad, como cifrado y acceso restringido, para proteger su información.
                      </p>
                    </section>
                    {/* Sección VIII */}
                    <section>
                      <h2 className="text-2xl font-bold mt-4">VIII. Cambios a este aviso de privacidad</h2>
                      <p className="mt-2 text-gray-700">
                        Este aviso de privacidad puede actualizarse periódicamente. La versión más reciente estará disponible en nuestro sitio web.
                      </p>
                    </section>
                    {/* Sección IX */}
                    <section>
                      <h2 className="text-2xl font-bold mt-4">IX. Cómo ponerse en contacto con nosotros</h2>
                      <p className="mt-2 text-gray-700">
                        Si tiene alguna pregunta sobre este aviso de privacidad, puede contactarnos a través de:
                      </p>
                      <ul className="list-disc list-inside ml-4 text-gray-700">
                        <li>
                          <strong>Correo electrónico:</strong>{' '}
                          <a
                            href="mailto:contacto@mxn.media"
                            className="text-blue-600 hover:underline"
                          >
                            contacto@mxn.media
                          </a>
                        </li>
                        <li>
                          <strong>Dirección postal:</strong> Leibnitz 20, col. Anzures, cp. 11590 CDMX México
                        </li>
                      </ul>
                    </section>
                    {/* Sección X */}
                    <section>
                      <h2 className="text-2xl font-bold mt-4">X. Leyes y reglamentos aplicables</h2>
                      <p className="mt-2 text-gray-700">
                        Este aviso de privacidad se redacta conforme a las leyes de Estados Unidos, incluyendo la Ley de Privacidad de
                        la Información de la Comunicación Electrónica (ECPA), la Ley de Protección de la Privacidad en Línea de los
                        Consumidores (COPPA) y la Ley de Privacidad de la Información del Consumidor de California (CCPA).
                      </p>
                    </section>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </UserProvider>
      </SidebarProvider>
    </>
  );
};

export async function getStaticProps() {
  const regionesResponse = await fetcher(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/region-estados?sort=nombre_completo:ASC&pagination[pageSize]=100`
  );
  return {
    props: {
      regiones: regionesResponse,
    },
  };
}

export default Politicas;
