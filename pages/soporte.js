
import Head from 'next/head';
import Nav from '../layouts/Nav';
import { UserProvider } from '../lib/authContext';
import { Sidebar } from '../layouts/Sidebar';
import { SidebarProvider } from "../contexts/SidebarContext"
import { useFetchUser } from '../lib/authContext';
import { fetcher } from '../lib/api';


const Politicas = ({ regiones }) => {
	const { user, loading } = useFetchUser();
	console.log({ regiones })
	return (
		<>
			<SidebarProvider>
				<UserProvider value={{ user, loading }}>
					<Head>
						<title>Informativo MXN</title>
					</Head>
					<div className="max-h-screen flex flex-col">
						{/* <PageHeader /> */}
						<Nav />
						<div className='grid grid-cols-[auto,1fr] flex-grow-1 overflow-auto'>
							{/* <Sidebar regiones={regiones} /> */}


							<div className='overflow-x-hidden px-8 pb-4'>
								<div className='sticky top-0 bg-white z-10 pb-4'>
									<h1 className='text-3xl font-bold'>Soporte al Usuario</h1>
								</div>
								<div>
									<main class="relative bg-white">
										
<div class="container mx-auto p-4">
    <h1 class="text-xl font-bold text-center mb-4">Bienvenido al Soporte de Informativo MXN</h1>
    <p class="text-center mb-8">Nuestro compromiso es brindarte una experiencia excepcional mientras te mantienes informado. Si tienes preguntas o necesitas asistencia, estás en el lugar correcto.</p>

    <div class="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 class="font-semibold text-lg mb-4">Preguntas Frecuentes (FAQ)</h2>
        
        <div class="mb-4">
            <h3 class="font-semibold">¿Cómo puedo personalizar mi feed de noticias?</h3>
            <p>Ve a la sección "Preferencias" y selecciona los Estados y Secciones para elegir tus categorías favoritas.</p>
        </div>

        <div class="mb-4">
            <h3 class="font-semibold">¿Qué hago si la aplicación se cierra inesperadamente?</h3>
            <p>Intenta reiniciarla, asegúrate de tener la última versión del SO y, si el problema persiste, contáctanos.</p>
        </div>

        <div class="mb-4">
            <h3 class="font-semibold">¿Puedo acceder a artículos antiguos?</h3>
            <p>Sí, navega por la sección del Estado preferido y haz scroll hasta la fecha que buscas.</p>
        </div>

        <div class="mb-4">
            <h3 class="font-semibold">¿Cómo puedo reportar un error o problema técnico?</h3>
            <p>Envía tu reporte a nuestro correo electrónico de soporte.</p>
        </div>
    </div>

    <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="font-semibold text-lg mb-4">Contacto</h2>
        <p>Si necesitas más ayuda, no dudes en contactarnos por cualquiera de los siguientes medios:</p>
        <ul class="list-disc pl-5 mt-4">
            <li>Correo Electrónico: <a href="mailto:soporte@mxn.media" class="text-blue-500">soporte@mxn.media</a></li>
            <li>Redes Sociales: Síguenos y envíanos un mensaje a través de nuestras plataformas.</li>
        </ul>
    </div>
</div>

									</main>
								</div>
							</div>
						</div>
					</div>
				</UserProvider>
			</SidebarProvider>
		</>
	)

}

export async function getStaticProps() {

	const regionesResponse = await fetcher(
		`${process.env.NEXT_PUBLIC_STRAPI_URL}/region-estados?sort=nombre_completo:ASC&pagination[pageSize]=100`
	);
	// console.log({ regionesResponse })
	return {
		props: {
			regiones: regionesResponse,
		},
	};
}
export default Politicas;