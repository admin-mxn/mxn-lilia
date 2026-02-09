import Link from 'next/link';
import { colors } from '../lib/styles';

// Función para formatear números (1500 -> 1.5K)
function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

// Función para formatear duración ISO 8601 (PT3M40S -> 3:40)
function formatDuration(isoDuration) {
  if (!isoDuration) return '';
  
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';
  
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Función para tiempo relativo
function timeAgo(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  const intervals = {
    año: 31536000,
    mes: 2592000,
    semana: 604800,
    día: 86400,
    hora: 3600,
    minuto: 60
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      const plural = interval > 1 ? (unit === 'mes' ? 'es' : 's') : '';
      return `hace ${interval} ${unit}${plural}`;
    }
  }
  
  return 'hace un momento';
}

// Card para vista desktop (horizontal compacta)
const YoutubeVideoCard = ({ video }) => {
  const attrs = video.attributes || video;
  const thumbnailUrl = attrs.thumbnail_url || attrs.thumbnailUrl;
  const youtubeUrl = attrs.url || `https://www.youtube.com/watch?v=${attrs.youtube_id}`;
  
  return (
    <a 
      href={youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 group hover:bg-gray-50 p-2 rounded-lg transition"
    >
      {/* Thumbnail */}
      <div className="relative flex-shrink-0 w-32 h-20 rounded overflow-hidden bg-gray-200">
        {thumbnailUrl && (
          <img 
            src={thumbnailUrl} 
            alt={attrs.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        )}
        {/* Duración */}
        {attrs.duracion && (
          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
            {formatDuration(attrs.duracion)}
          </span>
        )}
        {/* Play icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors">
          {attrs.titulo}
        </h4>
        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
          {attrs.vistas && (
            <span>{formatNumber(attrs.vistas)} vistas</span>
          )}
          {attrs.fecha_publicacion && (
            <>
              <span>•</span>
              <span>{timeAgo(attrs.fecha_publicacion)}</span>
            </>
          )}
        </div>
      </div>
    </a>
  );
};

// Card para vista móvil (vertical, para scroll horizontal)
const YoutubeVideoCardMobile = ({ video }) => {
  const attrs = video.attributes || video;
  const thumbnailUrl = attrs.thumbnail_url || attrs.thumbnailUrl;
  const youtubeUrl = attrs.url || `https://www.youtube.com/watch?v=${attrs.youtube_id}`;
  
  return (
    <a 
      href={youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 w-44 group"
    >
      {/* Thumbnail */}
      <div className="relative w-44 h-24 rounded-lg overflow-hidden bg-gray-200">
        {thumbnailUrl && (
          <img 
            src={thumbnailUrl} 
            alt={attrs.titulo}
            className="w-full h-full object-cover"
          />
        )}
        {/* Duración */}
        {attrs.duracion && (
          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
            {formatDuration(attrs.duracion)}
          </span>
        )}
        {/* Play icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Info */}
      <div className="mt-2">
        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
          {attrs.titulo}
        </h4>
        <p className="mt-1 text-xs text-gray-500">
          {attrs.vistas ? `${formatNumber(attrs.vistas)} vistas` : ''}
        </p>
      </div>
    </a>
  );
};

// Componente para móvil - Scroll horizontal
export const YoutubeMobileSection = ({ videos = [], channel }) => {
  const channelAttrs = channel?.attributes || channel;
  
  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <section className="lg:hidden bg-gradient-to-b from-gray-900 to-gray-800 py-6">
      <div className="px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">
                {channelAttrs?.nombre || 'MXN TELEVISIÓN'}
              </h3>
              <p className="text-xs text-gray-400">Últimos videos</p>
            </div>
          </div>
          <a 
            href={`https://www.youtube.com/channel/${channelAttrs?.youtube_id || 'UCGPHajQUKXZpfTFTp27NHwQ'}?sub_confirmation=1`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 bg-red-600 text-white text-sm font-semibold rounded-full hover:bg-red-700 transition"
          >
            Suscribirse
          </a>
        </div>
      </div>
      
      {/* Scroll horizontal de videos */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 px-4 pb-2" style={{ width: 'max-content' }}>
          {videos.map((video) => (
            <YoutubeVideoCardMobile key={video.id} video={video} />
          ))}
          
          {/* Card "Ver más" */}
          <a 
            href={`https://www.youtube.com/channel/${channelAttrs?.youtube_id || 'UCGPHajQUKXZpfTFTp27NHwQ'}/videos`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-44 h-24 rounded-lg bg-red-600/20 border-2 border-dashed border-red-500 flex flex-col items-center justify-center text-red-400 hover:bg-red-600/30 transition"
          >
            <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <span className="text-sm font-medium">Ver todos</span>
          </a>
        </div>
      </div>
    </section>
  );
};

// Sidebar para desktop
const YoutubeSidebar = ({ videos = [], channel }) => {
  const channelAttrs = channel?.attributes || channel;
  
  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <aside className="hidden lg:block w-80 flex-shrink-0">
      <div className="sticky top-4 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header con info del canal */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg">
                {channelAttrs?.nombre || 'MXN TELEVISIÓN'}
              </h3>
              {channelAttrs?.suscriptores && (
                <p className="text-sm text-white/80">
                  {formatNumber(channelAttrs.suscriptores)} suscriptores
                </p>
              )}
            </div>
          </div>
          
          {/* Botón suscribirse */}
          <a 
            href={`https://www.youtube.com/channel/${channelAttrs?.youtube_id || 'UCGPHajQUKXZpfTFTp27NHwQ'}?sub_confirmation=1`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block w-full bg-white text-red-600 text-center py-2 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Suscribirse
          </a>
        </div>
        
        {/* Lista de videos */}
        <div className="p-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Últimos Videos
          </h4>
          
          <div className="space-y-2">
            {videos.map((video) => (
              <YoutubeVideoCard key={video.id} video={video} />
            ))}
          </div>
          
          {/* Ver más */}
          <a 
            href={`https://www.youtube.com/channel/${channelAttrs?.youtube_id || 'UCGPHajQUKXZpfTFTp27NHwQ'}/videos`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block w-full text-center py-2 text-red-600 hover:text-red-700 font-medium text-sm hover:bg-red-50 rounded-lg transition"
          >
            Ver todos los videos →
          </a>
        </div>
      </div>
    </aside>
  );
};

export default YoutubeSidebar;
