'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { colors } from '../lib/styles';

function PrimerasPlanas({ limit = 12, showLoadMore = true }) {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState([]);

  const ITEMS_PER_PAGE = limit;

  // Cargar fechas disponibles al montar
  useEffect(() => {
    loadAvailableDates();
  }, []);

  // Cargar notas cuando cambie la fecha
  useEffect(() => {
    loadNotas(true);
  }, [selectedDate]);

  // Obtener fechas únicas disponibles
  const loadAvailableDates = async () => {
    try {
      const params = new URLSearchParams({
        'pagination[pageSize]': 1000,
        'fields': 'createdAt',
        'sort': 'createdAt:DESC'
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/newsletter-notas?${params}`);
      const data = await response.json();

      // Extraer fechas únicas (solo día)
      const dates = [...new Set(
        (data.data || []).map(nota => {
          const date = new Date(nota.attributes?.createdAt || nota.createdAt);
          return date.toISOString().split('T')[0];
        })
      )].sort((a, b) => new Date(b) - new Date(a));

      setAvailableDates(dates);
    } catch (error) {
      console.error('Error al cargar fechas:', error);
    }
  };

  // Función para cargar notas
  const loadNotas = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      setError(null);

      const page = reset ? 1 : currentPage;
      
      const params = new URLSearchParams({
        'pagination[page]': page,
        'pagination[pageSize]': ITEMS_PER_PAGE,
        'populate': '*',
        'sort': 'createdAt:DESC'
      });

      // Filtrar por fecha si está seleccionada
      if (selectedDate) {
        const startDate = `${selectedDate}T00:00:00.000Z`;
        const endDate = `${selectedDate}T23:59:59.999Z`;
        params.append('filters[createdAt][$gte]', startDate);
        params.append('filters[createdAt][$lte]', endDate);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/newsletter-notas?${params}`);
      const data = await response.json();

      if (reset) {
        setNotas(data.data || []);
        setCurrentPage(1);
      } else {
        setNotas(prev => [...prev, ...(data.data || [])]);
      }

      setHasMore(page < data.meta?.pagination?.pageCount);
      
    } catch (error) {
      console.error('Error al cargar notas:', error);
      setError('Error al cargar las notas');
    } finally {
      setLoading(false);
    }
  }, [currentPage, ITEMS_PER_PAGE, selectedDate]);

  // Cargar más
  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadNotasPage(nextPage);
    }
  };

  const loadNotasPage = async (page) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        'pagination[page]': page,
        'pagination[pageSize]': ITEMS_PER_PAGE,
        'populate': '*',
        'sort': 'createdAt:DESC'
      });

      // Filtrar por fecha si está seleccionada
      if (selectedDate) {
        const startDate = `${selectedDate}T00:00:00.000Z`;
        const endDate = `${selectedDate}T23:59:59.999Z`;
        params.append('filters[createdAt][$gte]', startDate);
        params.append('filters[createdAt][$lte]', endDate);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/newsletter-notas?${params}`);
      const data = await response.json();

      setNotas(prev => [...prev, ...(data.data || [])]);
      setHasMore(page < data.meta?.pagination?.pageCount);
      
    } catch (error) {
      console.error('Error al cargar más notas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Formatear fecha para mostrar
  const formatFecha = (fecha) => {
    try {
      return new Date(fecha).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return '';
    }
  };

  // Formatear fecha para el selector
  const formatDateLabel = (dateStr) => {
    try {
      const date = new Date(dateStr + 'T12:00:00');
      return date.toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateStr;
    }
  };

  // Colores por sección
  const getSectionColor = (seccion) => {
    const sectionColors = {
      'POLÍTICA': '#DC2626',
      'ECONOMÍA': '#EA580C',
      'SOCIEDAD': '#EF4444',
      'DEPORTES': '#F97316',
      'CULTURA': '#B91C1C',
      'INTERNACIONAL': '#C2410C',
      'SEGURIDAD': '#991B1B',
      'TECNOLOGÍA': '#FB923C',
      'SALUD': '#F87171'
    };
    return sectionColors[seccion] || colors.accent;
  };

  if (error) {
    return (
      <div className="text-center py-8 text-gray-500">
        {error}
      </div>
    );
  }

  return (
    <section className="py-8">
      {/* Selector de fecha */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <label className="text-gray-700 font-medium">Filtrar por día:</label>
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-opacity-50"
        >
          <option value="">Todas las fechas</option>
          {availableDates.map((date) => (
            <option key={date} value={date}>
              {formatDateLabel(date)}
            </option>
          ))}
        </select>
        {selectedDate && (
          <button
            onClick={() => setSelectedDate('')}
            className="text-sm hover:underline"
            style={{ color: colors.accent }}
          >
            Limpiar filtro
          </button>
        )}
      </div>

      {/* Grid de notas */}
      {loading && notas.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-48 animate-pulse" />
          ))}
        </div>
      ) : notas.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No hay notas para esta fecha.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {notas.map((nota) => {
              const attrs = nota.attributes || nota;
              return (
                <article 
                  key={nota.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
                >
                  {/* Badge de sección */}
                  <div className="p-3 border-b border-gray-100">
                    <span 
                      className="inline-block text-white text-xs font-bold px-2 py-1 rounded"
                      style={{ backgroundColor: getSectionColor(attrs.seccion) }}
                    >
                      {attrs.seccion || 'GENERAL'}
                    </span>
                    {attrs.estado_verificacion === 'verificado' && (
                      <span className="ml-2 inline-flex items-center bg-green-500 text-white text-xs px-2 py-0.5 rounded">
                        ✓ Verificado
                      </span>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2">
                      {attrs.titulo || 'Sin título'}
                    </h3>
                    <p className="text-gray-600 text-xs line-clamp-3 mb-3">
                      {attrs.descripcion}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{attrs.autor}</span>
                      <span>{formatFecha(attrs.createdAt)}</span>
                    </div>

                    {/* Link a fuente */}
                    {attrs.url_original && (
                      <a 
                        href={attrs.url_original}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center text-xs font-medium hover:underline"
                        style={{ color: colors.accent }}
                      >
                        Leer nota completa →
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Botón cargar más */}
          {showLoadMore && hasMore && (
            <div className="text-center mt-6">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-2 text-white rounded-lg hover:opacity-80 transition disabled:opacity-50"
                style={{ backgroundColor: colors.accent }}
              >
                {loading ? 'Cargando...' : 'Cargar más notas'}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default PrimerasPlanas;
