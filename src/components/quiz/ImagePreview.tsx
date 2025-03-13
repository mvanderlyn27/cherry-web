import React from "react";

interface ImagePreviewProps {
  imageUrl: string;
  altText?: string;
}

/**
 * ImagePreview component displays the generated image with proper styling
 */
export const ImagePreview = ({ imageUrl, altText = "Shareable result image" }: ImagePreviewProps) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-lg shadow-lg">
        <img src={imageUrl} alt={altText} className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default ImagePreview;
