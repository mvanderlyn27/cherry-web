import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ImagePreview from "./ImagePreview";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// Import both generators
import { generateShareImageFromHTML } from "../../../lib/utils/share-image-html";
import { renderComponentToImage } from "../../../lib/utils/detached-dom-renderer";
import ShareImageTemplate from "./ShareImageTemplate";

interface ShareableImageProps {
  title: string;
  imageSrc: string;
  mainTitle: string;
  description: string;
  websiteUrl?: string;
  fileName?: string;
  userName: string;
}

/**
 * ShareableImage component generates and displays a shareable image based on quiz results
 * with improved aesthetics, customization options, and platform-specific sharing
 */
const isMobile = () => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

export const ShareableImage = ({
  title = "My Result",
  imageSrc,
  mainTitle,
  description,
  websiteUrl = "http://cherryromance.vercel.app/quiz/book-bf",
  fileName = "my-result.png",
  userName,
}: ShareableImageProps) => {
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagePreloaded, setImagePreloaded] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Reset share success after delay
  useEffect(() => {
    if (shareSuccess) {
      const timer = setTimeout(() => {
        setShareSuccess(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [shareSuccess]);

  // Check if device is mobile
  const isMobileDevice = isMobile();
  // Inside the component
  useEffect(() => {
    console.log("Is mobile device:", isMobileDevice);
    console.log("UserAgent:", navigator.userAgent);
  }, [isMobileDevice]);

  // Preload the image to ensure it's ready for capture
  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImagePreloaded(true);
      console.log("Image preloaded successfully:", imageSrc);
    };
    img.onerror = (e) => {
      console.error("Failed to preload image:", imageSrc, e);
      // Continue anyway, html2canvas will handle the error
      setImagePreloaded(true);
    };
    img.src = imageSrc;

    // Set a timeout to prevent hanging if image loading takes too long
    const timeout = setTimeout(() => {
      if (!imagePreloaded) {
        console.warn("Image preload timed out, continuing anyway");
        setImagePreloaded(true);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [imageSrc]);

  const handleShare = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: blob.type });

      if (navigator.share) {
        await navigator.share({
          files: [file],
          text: `Find your book boyfriend soulmate at: \n\n ${websiteUrl}`,
        });
        setShareSuccess(true);
        // Show success toast
        toast.success("Image shared successfully!");
      }
    } catch (error) {
      console.error("Sharing failed:", error);
      toast.error("Could not share image");
    }
  };

  const handleGenerate = async () => {
    if (!imageSrc) {
      toast.error("No image available to share");
      return;
    }

    setIsGenerating(true);
    try {
      // Preload all images before generation
      const imagesToPreload = [
        imageSrc,
        `${window.location.origin}/quiz/results/bg.png`,
        `${window.location.origin}/quiz/results/divider_top.png`,
        `${window.location.origin}/quiz/results/divider_mid.png`
      ];

      await Promise.all(
        imagesToPreload.map(
          (src) =>
            new Promise((resolve, reject) => {
              const img = new Image();
              img.crossOrigin = "anonymous";
              img.onload = resolve;
              img.onerror = resolve; // Continue even if error
              img.src = src;
            })
        )
      );

      const dataUrl = await renderComponentToImage(
        ShareImageTemplate,
        {
          imageSrc,
          title,
          mainTitle,
          description,
          websiteUrl,
          userName,
          imageMode: true, // Force image mode
        },
        {
          width: 1080,
          height: 1920,
          scale: 2,
          backgroundColor: null,
        }
      );

      setGeneratedImageUrl(dataUrl);
      setIsGenerating(false);

      if (isMobileDevice) {
        // On mobile, directly trigger share
        console.log("Triggering share on mobile");
        handleShare(dataUrl);
      }
    } catch (error) {
      console.error("Image generation failed:", error);
      toast.error("Failed to generate shareable image");
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="relative">
        <div
          className={`transition-all duration-300 ${
            shareSuccess ? "opacity-100 transform scale-100" : "opacity-0 transform scale-95"
          } absolute inset-0`}>
          <div className="flex items-center font-[Comme] text-sm bg-green-500/20 text-white px-6 py-2 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Shared!
          </div>
        </div>
        <div
          className={`transition-all duration-300 ${
            shareSuccess ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100"
          }`}>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {!isMobileDevice ? (
              <DialogTrigger asChild>
                <ShareButton isLoading={isGenerating} onClick={handleGenerate} />
              </DialogTrigger>
            ) : (
              <ShareButton isLoading={isGenerating} onClick={handleGenerate} />
            )}
            <DialogContent
              className="bg-black/30 backdrop-blur-xl border border-white/10 max-h-[90vh] flex flex-col"
              aria-label="Share your results">
              <DialogHeader>
                <DialogTitle className="text-white text-center">Share Your Results</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto min-h-0 px-4">
                <ImagePreview imageUrl={generatedImageUrl} />
              </div>
              <div className="flex gap-4 justify-center p-4 mt-4 border-t border-white/10">
                <DownloadButton imageUrl={generatedImageUrl} fileName={fileName} />
                <CopyButton imageUrl={generatedImageUrl} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

// New component for the share button
const ShareButton = ({ isLoading, onClick }: { isLoading: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className={`flex items-center font-[Comme] text-sm cursor-pointer bg-white/10 text-white px-6 py-2 rounded-full transition-all duration-300 ${
      isLoading ? "opacity-50" : "hover:bg-white/20"
    }`}>
    {isLoading ? (
      <>
        <SpinnerIcon />
        Generating...
      </>
    ) : (
      <>
        <ShareIcon />
        Share
      </>
    )}
  </button>
);

// Download button component
const DownloadButton = ({ imageUrl, fileName }: { imageUrl: string; fileName: string }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center font-[Comme] text-sm cursor-pointer bg-white/10 text-white px-6 py-2 rounded-full transition-all duration-300 hover:bg-white/20">
      <DownloadIcon />
      Download
    </button>
  );
};

// Copy button component
const CopyButton = ({ imageUrl }: { imageUrl: string }) => {
  const handleCopy = async () => {
    try {
      const blob = await (await fetch(imageUrl)).blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      toast.success("Image copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy image:", error);
      toast.error("Failed to copy image");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center font-[Comme] text-sm cursor-pointer bg-white/10 text-white px-6 py-2 rounded-full transition-all duration-300 hover:bg-white/20">
      <CopyIcon />
      Copy
    </button>
  );
};

// Icon components
const ShareIcon = () => (
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
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
    />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    className="animate-spin h-4 w-4 mr-2"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const DownloadIcon = () => (
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
);

const CopyIcon = () => (
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
      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
    />
  </svg>
);

export default ShareableImage;
