import React from "react";
import { toast } from "sonner";

interface ShareButtonsProps {
  imageUrl: string;
  fileName: string;
  title: string;
  text: string;
}

/**
 * ShareButtons component provides platform-specific sharing options
 * and a universal save button for the generated image
 */
export const ShareButtons = ({ imageUrl, fileName, title, text }: ShareButtonsProps) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleSaveImage = () => {
    const link = document.createElement("a");
    link.download = fileName;
    link.href = imageUrl;
    link.click();
    toast("Image saved!");
  };

  const handleShare = (platform?: string) => {
    if (platform && isMobile) {
      let shareUrl = "";

      // Create blob URL for image to share
      fetch(imageUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], fileName, { type: "image/png" });
          const filesArray = [file];

          switch (platform) {
            case "instagram":
              // Instagram requires the Instagram app to be installed
              // and doesn't have a direct web API for sharing
              if (navigator.share) {
                navigator
                  .share({
                    files: filesArray,
                    title,
                    text,
                  })
                  .catch((error) => {
                    if (error.name !== "AbortError") {
                      toast("Could not share to Instagram. Try saving the image instead.");
                      // Fallback to direct save
                      handleSaveImage();
                    }
                  });
              } else {
                toast("Instagram sharing not supported on this device. Image saved instead.");
                handleSaveImage();
              }
              break;

            case "facebook":
              // Facebook sharing via app
              shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
              window.open(shareUrl, "_blank");
              toast("Opening Facebook...");
              break;

            case "messenger":
              // Facebook Messenger sharing
              shareUrl = `fb-messenger://share/?link=${encodeURIComponent(window.location.href)}`;
              window.open(shareUrl, "_blank");
              toast("Opening Messenger...");
              break;

            default:
              // Default sharing mechanism
              if (navigator.share) {
                navigator
                  .share({
                    files: filesArray,
                    title,
                    text,
                  })
                  .catch((error) => {
                    if (error.name !== "AbortError") {
                      toast("Could not share. Image saved instead.");
                      handleSaveImage();
                    }
                  });
              } else {
                handleSaveImage();
              }
          }
        })
        .catch((error) => {
          console.error("Error preparing image for sharing:", error);
          toast("Could not prepare image for sharing. Try saving instead.");
          handleSaveImage();
        });
    } else {
      // For desktop or when no platform specified
      handleSaveImage();
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {isMobile && (
        <>
          {/* Instagram share button */}
          <button
            onClick={() => handleShare("instagram")}
            className="flex items-center font-[Comme] text-sm cursor-pointer bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-full transition-all duration-300 hover:opacity-90"
            aria-label="Share to Instagram">
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            Instagram
          </button>

          {/* Facebook share button */}
          <button
            onClick={() => handleShare("facebook")}
            className="flex items-center font-[Comme] text-sm cursor-pointer bg-[#1877F2] text-white px-4 py-2 rounded-full transition-all duration-300 hover:opacity-90"
            aria-label="Share to Facebook">
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
            </svg>
            Facebook
          </button>

          {/* Messenger share button */}
          <button
            onClick={() => handleShare("messenger")}
            className="flex items-center font-[Comme] text-sm cursor-pointer bg-gradient-to-r from-[#00B2FF] to-[#006AFF] text-white px-4 py-2 rounded-full transition-all duration-300 hover:opacity-90"
            aria-label="Share to Messenger">
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.36 2 2 6.13 2 11.7C2 14.61 3.33 17.13 5.47 18.73C5.65 18.87 5.76 19.07 5.76 19.29L5.8 21.29C5.8 21.74 6.21 22.07 6.64 21.93L8.73 21.1C8.94 21.03 9.17 21.05 9.36 21.16C10.19 21.47 11.07 21.64 12 21.64C17.64 21.64 22 17.5 22 11.94C22 6.38 17.67 2 12 2ZM18.33 9.13L15.03 14.47C14.67 15.06 13.88 15.21 13.35 14.79L10.95 12.92C10.7 12.73 10.36 12.73 10.11 12.92L7.5 14.97C7.09 15.29 6.57 14.76 6.88 14.35L10.18 9.01C10.54 8.42 11.33 8.27 11.86 8.69L14.26 10.56C14.5 10.75 14.85 10.75 15.09 10.56L17.7 8.51C18.12 8.19 18.64 8.72 18.33 9.13Z" />
            </svg>
            Messenger
          </button>
        </>
      )}

      {/* Save image button (universal) */}
      <button
        onClick={handleSaveImage}
        className="flex items-center font-[Comme] text-sm cursor-pointer bg-white/10 text-white px-4 py-2 rounded-full transition-all duration-300 hover:bg-white/20"
        aria-label="Save image">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Save Image
      </button>
    </div>
  );
};

export default ShareButtons;
