import React, { useState, useEffect } from "react";
import { getActiveBanners, selectWeightedRandomBanner, getBannerImageUrl } from "../lib/banners";

const HomeBanner = () => {
  const [currentBanner, setCurrentBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // Obtener banners de la posición 'top' o todos si no hay específicos
        const banners = await getActiveBanners('top');
        
        if (banners.length > 0) {
          // Seleccionar un banner aleatorio basado en pesos
          const selectedBanner = selectWeightedRandomBanner(banners);
          setCurrentBanner(selectedBanner);
        }
      } catch (error) {
        console.error('Error loading banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading || !currentBanner) return null;

  const imageUrl = getBannerImageUrl(currentBanner);

  return (
    <div className="w-full flex justify-center bg-gray-100  ">
      <div className="w-full max-w-6xl px-4 md:px-8">
        <a
          href={currentBanner.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          <img 
            src={imageUrl} 
            alt={currentBanner.alt}
            className="w-full   rounded-lg h-20 md:h-24 lg:h-28 object-contain"
          />
        </a>
      </div>
    </div>
  );
};

export default HomeBanner;
