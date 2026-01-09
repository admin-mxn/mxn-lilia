import ArticuloCard from './ArticuloCard';

export default function ArticulosGrid({ articulos, titulo }) {
    if (!articulos || articulos.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                No hay artículos disponibles.
            </div>
        );
    }

    return (
        <section className="py-8">
            {titulo && (
                <h2 className="text-2xl font-bold text-gray-900 mb-6 px-4">
                    {titulo}
                </h2>
            )}
            <div className="flex flex-col gap-6 px-4 max-w-4xl mx-auto">
                {articulos.map((articulo) => (
                    <ArticuloCard 
                        key={articulo.id} 
                        articulo={articulo} 
                    />
                ))}
            </div>
        </section>
    );
}
