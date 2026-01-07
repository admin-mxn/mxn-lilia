import React, { useState, useEffect } from "react";
import { AdFooter } from "../components/AdSense";
import Banner from "./Banner";
import { getActiveBanners, selectWeightedRandomBanner, getBannerImageUrl, getBannerImageFormat } from "../lib/banners";

const Footer = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // Obtener banners que incluyan la posición 'bottom'
        const banners = await getActiveBanners('bottom');
        
        if (banners.length > 0) {
          // Seleccionar un banner aleatorio basado en pesos
          const selectedBanner = selectWeightedRandomBanner(banners);
          setCurrentBanner(selectedBanner);
        }
      } catch (error) {
        console.error('Error loading footer banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) return null;

  const largeImageUrl = currentBanner ? getBannerImageUrl(currentBanner) : null;
  const smallImageUrl = currentBanner ? getBannerImageFormat(currentBanner, 'small') : null;

  return (
    <>
      <footer className="bottom-0 z-20 sticky flex w-full justify-center bg-gray-200">
        {showBanner && currentBanner && (
          <>
            <div className="relative flex w-full max-w-7xl">
              <div className="flex justify-center w-full my-1 bg-gray-200">
                <a
                  href={currentBanner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <picture>
                    <source
                      media="(max-width: 640px)"
                      srcSet={smallImageUrl || largeImageUrl}
                    />
                    <img 
                      src={largeImageUrl} 
                      alt={currentBanner.alt}
                      className="w-full h-20 md:h-24 lg:h-28 object-contain"
                    />
                  </picture>
                </a>
              </div>
              {/* <button
                onClick={() => setShowBanner(false)}
                className="text-sm align-middle text-center w-8 h-8 rounded-full bg-red-500 text-white absolute top-0 right-2"
              <AdFooter />
              {/* <button
                onClick={() => setShowBanner(false)}
                className="text-sm align-middle text-center w-8 h-8 rounded-full bg-red-500 text-white absolute top-0 right-2"
              >
                X
              </button> */}
            </div>
          </>
        )}
      </footer>
    </>
  );
};

export default Footer;
