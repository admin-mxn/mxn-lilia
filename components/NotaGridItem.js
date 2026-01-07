import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

function NotaGridItem({ nota, priority = false, variant = 'normal', animationDelay = 0 }) {
  const attributes = nota.attributes;
  
  // Formatear fecha sin hora
  const formatFecha = (fecha) => {
    try {
      return new Date(fecha).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };



  // Colores por sección - Paleta de rojos y naranjas
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
      'SALUD': 'bg-red-400',
      'CIENCIA': 'bg-orange-800',
      'AMBIENTE': 'bg-red-300'
    };
    return colors[seccion] || 'bg-red-500';
  };

  // Mostrar descripción completa sin cortar
  const getFullDescription = (text) => {
    if (!text) return '';
    return text;
  };

  // Clases CSS basadas en variante
  const getVariantClasses = (variant) => {
    const baseClasses = "flex flex-col bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden w-full h-fit";
    
    switch (variant) {
      case 'grid':
        return `${baseClasses}`;
      case 'wide':
        return `${baseClasses} md:min-h-[200px]`;
      case 'tall':
        return `${baseClasses} md:min-h-[400px]`;
      case 'featured':
        return `${baseClasses} lg:min-h-[250px] border-2 border-blue-100 hover:border-blue-300`;
      default:
        return `${baseClasses}`;
    }
  };

  return (
    <motion.article 
      className={getVariantClasses(variant)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: animationDelay,
        duration: 0.4,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2 }
      }}
    >
      
      {/* Header con badges */}
      <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b">
        {/* Badge de sección */}
        <div className={`inline-block ${getSectionColor(attributes.seccion)} text-white text-xs font-bold px-3 py-1 rounded-full`}>
          {attributes.seccion || 'GENERAL'}
        </div>
        
        {/* Estado de verificación */}
        {attributes.estado_verificacion === 'verificado' && (
          <div className="inline-flex ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Verificado
          </div>
        )}
      </div>

      {/* Contenido de la nota */}
      <div className="flex flex-col flex-1 p-4">
        
        {/* Título */}
        <h2 className={`font-bold text-gray-900 mb-3 leading-tight ${
          variant === 'featured' || variant === 'wide' 
            ? 'text-xl line-clamp-3' 
            : 'text-lg line-clamp-2'
        }`}>
          {attributes.titulo || 'Sin título'}
        </h2>
        
        {/* Descripción */}
        <p className={`text-gray-600 mb-3 flex-1 leading-relaxed text-justify ${
          variant === 'tall' || variant === 'featured' 
            ? 'text-base' 
            : 'text-sm'
        }`}>
          {getFullDescription(attributes.descripcion)}
        </p>
        
        {/* Metadata */}
        <div className="flex flex-col gap-2 text-xs text-gray-500 border-t pt-3">
          
          {/* Autor y fecha */}
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              {/* Solo mostrar autor si existe */}
              {attributes.autor && (
                <span className="font-medium">
                  {attributes.autor}
                </span>
              )}
              {/* Fuente y enlace en la misma línea */}
              <div className="flex items-center gap-3">
                {attributes.fuente && (
                  <span className="text-gray-400">
                    � {attributes.fuente}
                  </span>
                )}
                {/* Enlace discreto */}
                {attributes.url_original && (
                  <Link 
                    href={attributes.url_original} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-xs hover:underline transition-colors duration-200 group"
                  >
                    <span>Leer completa</span>
                    <svg className="w-2.5 h-2.5 ml-1 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
            <span>
              {formatFecha(attributes.createdAt)}
            </span>
          </div>
          
          {/* Newsletter origen */}
          {attributes.newsletterOrigen && (
            <div className="text-xs text-gray-400 truncate">
              📧 {attributes.newsletterOrigen}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default NotaGridItem;