// Librería de colores y estilos de Lilia Portal

export const colors = {
    // Colores principales
    primary: '#AE2F33',        // Rojo - navbar principal
    secondary: '#585A5A',      // Gris - barra de navegación
    accent: '#69A6DB',         // Azul - botones, enlaces, acentos
    
    // Bordes y marcos
    border: '#BBBBBB',         // Gris - bordes de fotos y labels
    borderDark: '#231F20',     // Negro - bordes de navbar secundario
    
    // Fondos
    bgLight: '#F9FAFB',        // Gris muy claro - fondo de página (gray-50)
    bgWhite: '#FFFFFF',        // Blanco
    bgGradientFrom: '#EFF6FF', // Azul muy claro (blue-50) - gradientes
};

// Estilos de foto de autor
export const authorPhotoStyles = {
    // Contenedor externo con borde
    container: {
        backgroundColor: colors.bgWhite,
        border: `4px solid ${colors.border}`,
    },
    containerLarge: {
        backgroundColor: colors.bgWhite,
        border: `5px solid ${colors.border}`,
    },
    // Clases de Tailwind para el contenedor
    containerClass: 'bg-white p-1.5 rounded-tl-[2rem] rounded-br-[2rem]',
    containerClassSmall: 'bg-white p-0.5 rounded-tl-xl rounded-br-xl',
    containerClassLarge: 'bg-white p-2 rounded-tl-[3rem] rounded-br-[3rem] shadow-lg',
    // Clases para la imagen interna
    imageClass: 'relative w-full h-full overflow-hidden rounded-tl-[1.5rem] rounded-br-[1.5rem]',
    imageClassSmall: 'relative w-full h-full overflow-hidden rounded-tl-lg rounded-br-lg',
    imageClassLarge: 'relative w-full h-full overflow-hidden rounded-tl-[2.5rem] rounded-br-[2.5rem]',
};

// Estilos de labels (nombre de autor, redes sociales)
export const labelStyles = {
    // Label del nombre del autor (texto negro)
    authorName: {
        backgroundColor: colors.border,
    },
    authorNameClass: 'px-3 py-1 text-sm font-semibold text-black italic whitespace-nowrap rounded-bl-lg rounded-tr-lg',
    
    // Labels de redes sociales (texto blanco)
    socialLink: {
        backgroundColor: colors.border,
    },
    socialLinkClass: 'inline-block px-3 py-1 text-sm text-white hover:opacity-80 rounded-bl-lg rounded-tr-lg',
};

// Estilos de botones
export const buttonStyles = {
    primary: {
        backgroundColor: colors.accent,
    },
    primaryClass: 'inline-block text-white text-sm px-4 py-2 hover:opacity-80 transition',
};

// Estilos de headers de página
export const headerStyles = {
    gradient: {
        background: `linear-gradient(to right, ${colors.accent}, #3B82F6)`,
    },
    gradientClass: 'text-white py-12',
};

// Estilos de tarjetas
export const cardStyles = {
    base: 'bg-white border border-gray-200 shadow-sm overflow-hidden',
    hover: 'bg-white border border-gray-200 shadow-sm hover:shadow-lg transition overflow-hidden',
};

// Estilos de texto
export const textStyles = {
    // Título con borde izquierdo
    quoteBorder: {
        borderLeft: `4px solid ${colors.accent}`,
    },
    quoteClass: 'text-gray-700 italic pl-3',
};

export default {
    colors,
    authorPhotoStyles,
    labelStyles,
    buttonStyles,
    headerStyles,
    cardStyles,
    textStyles,
};
