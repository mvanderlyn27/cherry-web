import React, { useState, useEffect } from "react";

interface ImagePreviewProps {
  imageUrl: string;
  altText?: string;
}

/**
 * ImagePreview component displays the generated image with proper styling
 * and handles loading states and errors
 */
export const ImagePreview = ({ imageUrl, altText = "Shareable result image" }: ImagePreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      const viewportHeight = window.innerHeight;
      const maxHeight = viewportHeight * 0.7; // 70% of viewport height
      const aspectRatio = 9/16;
      const width = maxHeight * aspectRatio;
      
      setDimensions({
        height: maxHeight,
        width: width
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="w-full mx-auto flex justify-center">
      <div 
        className="relative overflow-hidden rounded-lg shadow-lg bg-black/50"
        style={{ 
          maxHeight: `${dimensions.height}px`,
          width: 'auto',
          aspectRatio: '9/16'
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-pink-200 rounded-full border-t-transparent"></div>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center flex-col p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-pink-200 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-white text-center">Failed to load image</p>
          </div>
        )}

        <img
          src={imageUrl}
          alt={altText}
          className={`w-full h-full object-contain ${
            isLoading || hasError ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
    </div>
  );
};

export default ImagePreview;
