'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Masonry from 'react-masonry-css';
import NotaGridItem from './NotaGridItem';

function Newsletter() {
  // Estados
  const [notas, setNotas] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [sortBy, setSortBy] = useState('mezclado');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalNotas, setTotalNotas] = useState(0);

  const ITEMS_PER_PAGE = 12;

  // Configuración de Masonry responsive
  const breakpointColumnsObj = {
    default: 5,
    1536: 5,  // 2xl: 5 columnas
    1280: 4,  // xl: 4 columnas  
    1024: 3,  // lg: 3 columnas
    768: 2,   // md: 2 columnas
    640: 2,   // sm: 2 columnas
    480: 1    // mobile: 1 columna
  };

  // Cargar secciones al montar el componente
  useEffect(() => {
    loadSecciones();
  }, []);

  // Cargar notas cuando cambien los filtros
  useEffect(() => {
    loadNotas(true);
  }, [searchTerm, selectedSection, sortBy]);

  // Función para cargar secciones
  const loadSecciones = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/newsletter-notas?fields=seccion&pagination[pageSize]=1000`);
      const data = await response.json();
      
      const uniqueSecciones = [...new Set(
        data.data
          .map(item => item.attributes.seccion)
          .filter(seccion => seccion && seccion.trim() !== '')
      )].sort();
      
      setSecciones(uniqueSecciones);
    } catch (error) {
      console.error('Error al cargar secciones:', error);
    }
  };

  // Función para mezclar notas respetando el orden cronológico y distribuyendo secciones
  const shuffleNotasBySection = (notas) => {
    if (notas.length === 0) return notas;

    // Las notas ya vienen ordenadas por fecha DESC de Strapi
    // Dividir en lotes de 10-15 notas para mezclar por secciones dentro de cada lote
    const BATCH_SIZE = 12;
    const resultado = [];

    for (let i = 0; i < notas.length; i += BATCH_SIZE) {
      const lote = notas.slice(i, i + BATCH_SIZE);
      
      // Agrupar el lote por secciones
      const notasPorSeccion = lote.reduce((acc, nota) => {
        const seccion = nota.attributes.seccion || 'Sin sección';
        if (!acc[seccion]) acc[seccion] = [];
        acc[seccion].push(nota);
        return acc;
      }, {});

      // Mezclar secciones dentro del lote manteniendo el orden cronológico relativo
      const secciones = Object.keys(notasPorSeccion);
      const maxNotasPorSeccion = Math.max(...Object.values(notasPorSeccion).map(arr => arr.length));

      // Intercalar notas por sección dentro del lote
      for (let j = 0; j < maxNotasPorSeccion; j++) {
        secciones.forEach(seccion => {
          if (notasPorSeccion[seccion][j]) {
            resultado.push(notasPorSeccion[seccion][j]);
          }
        });
      }
    }

    return resultado;
  };

  // Función para cargar notas
  const loadNotas = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      setError(null);

      const page = reset ? 1 : currentPage;
      
      // Construir parámetros de consulta
      const params = new URLSearchParams({
        'pagination[page]': page,
        'pagination[pageSize]': ITEMS_PER_PAGE,
        'populate': '*',
        'sort': sortBy === 'mezclado' ? 'createdAt:DESC' :
                sortBy === 'fecha' ? 'createdAt:DESC' : 
                sortBy === 'fecha:asc' ? 'createdAt:ASC' :
                sortBy === 'titulo' ? 'titulo:ASC' :
                sortBy === 'autor' ? 'autor:ASC' :
                sortBy === 'seccion' ? 'seccion:ASC,createdAt:DESC' : 'createdAt:DESC'
      });

      // Filtros
      if (selectedSection) {
        params.append('filters[seccion][$eq]', selectedSection);
      }

      if (searchTerm) {
        params.append('filters[$or][0][titulo][$containsi]', searchTerm);
        params.append('filters[$or][1][descripcion][$containsi]', searchTerm);
        params.append('filters[$or][2][autor][$containsi]', searchTerm);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/newsletter-notas?${params}`);
      const data = await response.json();

      // Aplicar ordenamiento personalizado para modo mezclado
      let processedData = data.data;
      if (sortBy === 'mezclado') {
        processedData = shuffleNotasBySection([...data.data]);
      }

      if (reset) {
        setNotas(processedData);
        setCurrentPage(1);
      } else {
        setNotas(prev => [...prev, ...processedData]);
      }

      setHasMore(page < data.meta.pagination.pageCount);
      setTotalNotas(data.meta.pagination.total);
      
    } catch (error) {
      console.error('Error al cargar notas:', error);
      setError('Error al cargar las notas del newsletter');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedSection, sortBy]);

  // Función para cargar más notas (paginación)
  const loadMore = () => {
    if (!loading && hasMore) {
      setCurrentPage(prev => prev + 1);
      loadNotas(false);
    }
  };

  // Función para resetear filtros
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSection('');
    setSortBy('mezclado');
    setCurrentPage(1);
  };

  // Memorizar el conteo de notas filtradas
  const filteredCount = useMemo(() => {
    return totalNotas;
  }, [totalNotas]);

  // Renderizar todas las notas con masonry (sin dividir por secciones)
  const renderAllNotas = () => {
    if (notas.length === 0) return null;

    return (
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex -ml-6 w-auto"
        columnClassName="pl-6 bg-clip-padding"
      >
        {notas.map((nota, index) => (
          <div key={`nota-${nota.id}`} className="mb-6">
            <NotaGridItem 
              nota={nota} 
              priority={index < 4}
              variant="masonry"
              animationDelay={index * 0.02}
            />
          </div>
        ))}
      </Masonry>
    );
  };

  // Variantes aleatorias para Masonry (el layout se maneja automáticamente)
  const getRandomVariant = (index) => {
    const variants = ['normal', 'tall', 'wide', 'featured'];
    // Usar el índice para crear patrones predecibles pero variados
    return variants[index % variants.length];
  };

  // Colores por sección (mismo que NotaGridItem pero centralizado)
  const getSectionColor = (seccion) => {
    const colors = {
      'POLÍTICA': 'bg-red-600',
      'ECONOMÍA': 'bg-orange-600',
      'SOCIEDAD': 'bg-red-500',
      'DEPORTES': 'bg-orange-500',
      'CULTURA': 'bg-red-700',
      'INTERNACIONAL': 'bg-orange-700',
      'SEGURIDAD': 'bg-red-800',
      'TECNOLOGÍA': 'bg-orange-400',
      'SALUD': 'bg-red-400'
    };
    return colors[seccion] || 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            
            {/* Título y descripción */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📧 Newsletter MXN
              </h1>
              <p className="text-gray-600">
                Noticias procesadas y verificadas de nuestros newsletters diarios
              </p>
              {filteredCount > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {filteredCount} {filteredCount === 1 ? 'nota encontrada' : 'notas encontradas'}
                </p>
              )}
            </div>

            {/* Botón de reset */}
            {(searchTerm || selectedSection || sortBy !== 'mezclado') && (
              <button
                onClick={resetFilters}
                className="self-start lg:self-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Búsqueda */}
            <div className="relative">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Buscar notas
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por título, descripción o autor..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filtro por sección */}
            <div>
              <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">
                Sección
              </label>
              <select
                id="section"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas las secciones</option>
                {secciones.map(seccion => (
                  <option key={seccion} value={seccion}>
                    {seccion}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenar por */}
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                Ordenar por
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="mezclado">Mezclado</option>
                <option value="fecha">Más recientes</option>
                <option value="fecha:asc">Más antiguos</option>
                <option value="titulo">Título A-Z</option>
                <option value="autor">Autor A-Z</option>
                <option value="seccion">Sección</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-medium text-red-800 mb-2">Error al cargar las notas</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => loadNotas(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Reintentar
            </button>
          </div>
        ) : notas.length === 0 && !loading ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No hay notas disponibles</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedSection 
                ? 'No se encontraron notas con los filtros aplicados.' 
                : 'Aún no hay notas procesadas del newsletter.'
              }
            </p>
            {(searchTerm || selectedSection) && (
              <button
                onClick={resetFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Mostrar todas las notas
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Grid tipo periódico sin secciones - Masonry layout */}
            <div className="mb-8">
              {renderAllNotas()}
            </div>

            {/* Botón cargar más */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Cargando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Cargar más notas
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Indicador de carga inicial */}
            {loading && notas.length === 0 && (
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex -ml-6 w-auto"
                columnClassName="pl-6 bg-clip-padding"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse mb-6">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4">
                      <div className="h-4 bg-gray-300 rounded w-20"></div>
                    </div>
                    <div className="p-4">
                      <div className="h-5 bg-gray-300 rounded mb-3"></div>
                      <div className={`space-y-2 ${i % 3 === 0 ? 'pb-8' : i % 3 === 1 ? 'pb-16' : 'pb-4'}`}>
                        <div className="h-3 bg-gray-300 rounded"></div>
                        <div className="h-3 bg-gray-300 rounded"></div>
                        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                        {i % 3 === 1 && (
                          <>
                            <div className="h-3 bg-gray-300 rounded"></div>
                            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </Masonry>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Newsletter;