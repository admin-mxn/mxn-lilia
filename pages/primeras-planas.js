import Head from 'next/head';
import NavLilia from '../layouts/NavLilia';
import Footer from '../layouts/Footer';
import { UserProvider, useFetchUser } from '../lib/authContext';
import PrimerasPlanas from '../components/PrimerasPlanas';
import HomeBanner from '../components/HomeBanner';
import MiddleBanner from '../components/MiddleBanner';
import { colors } from '../lib/styles';

const PrimerasPlanasPage = () => {
    const { user, loading } = useFetchUser();

    return (
        <UserProvider value={{ user, loading }}>
            <Head>
                <title>Primeras Planas | Lilia</title>
                <meta name="description" content="Las noticias más relevantes del día" />
            </Head>

            <div className="min-h-screen flex flex-col bg-gray-50">
                <NavLilia />

                {/* Banner superior */}
                <HomeBanner />

                <main className="flex-1">
                    {/* Header */}
                    <header className="text-white py-12" style={{ background: `linear-gradient(to right, ${colors.accent}, #3B82F6)` }}>
                        <div className="max-w-6xl mx-auto px-4 text-center">
                            <h1 className="text-4xl font-bold">Primeras Planas</h1>
                            <p className="mt-2 text-white/80 text-lg">
                                Las noticias más relevantes procesadas de nuestros newsletters diarios
                            </p>
                        </div>
                    </header>

                    {/* Banner medio */}
                    <MiddleBanner />

                    {/* Contenido */}
                    <div className="max-w-6xl mx-auto px-4 py-8">
                        <PrimerasPlanas limit={12} showLoadMore={true} />
                    </div>
                </main>

                <Footer />
            </div>
        </UserProvider>
    );
};

export default PrimerasPlanasPage;
