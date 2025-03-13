import React, { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ImagePreview from "./ImagePreview";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { generateShareImage } from "@/lib/utils/share-image";

interface ShareableImageProps {
  title: string;
  imageSrc: string;
  mainTitle: string;
  description: string;
  storyText?: string;
  websiteUrl?: string;
  fileName?: string;
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
  storyText,
  websiteUrl = "cherryapp.vercel.app",
  fileName = "my-result.png",
}: ShareableImageProps) => {
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleShare = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: blob.type });
      
      if (navigator.share) {
        await navigator.share({
          files: [file],
          text: `Find yours at ${websiteUrl}`,
        });
      }
    } catch (error) {
      console.error('Sharing failed:', error);
      toast.error('Could not share image');
    }
  };

  const handleGenerate = async () => {
    if (isMobile() && generatedImageUrl) {
      handleShare(generatedImageUrl);
      return;
    }

    setIsGenerating(true);
    try {
      const dataUrl = await generateShareImage({
        imageSrc,
        title,
        mainTitle,
        description,
        websiteUrl
      });
      
      setGeneratedImageUrl(dataUrl);
      setIsGenerating(false);
      
      if (isMobile()) {
        handleShare(dataUrl);
      } else {
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Image generation failed:', error);
      toast.error('Failed to generate shareable image');
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <ShareButton 
          isLoading={isGenerating}
          onClick={handleGenerate}
        />
      </DialogTrigger>

      <ShareDialogContent 
        imageUrl={generatedImageUrl}
        fileName={fileName}
        onClose={() => setIsOpen(false)}
      />
    </Dialog>
  );
};

// New component for the share button
const ShareButton = ({ isLoading, onClick }: { 
  isLoading: boolean; 
  onClick: () => void 
}) => (
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
        Share Results
      </>
    )}
  </button>
);

// New component for dialog content
const ShareDialogContent = ({ imageUrl, fileName, onClose }: {
  imageUrl: string;
  fileName: string;
  onClose: () => void;
}) => (
  <DialogContent className="bg-black/30 backdrop-blur-xl border border-white/10 max-w-2xl h-[calc(100vh-2rem)] flex flex-col">
    <DialogHeader>
      <DialogTitle className="text-white text-center">Share Your Results</DialogTitle>
    </DialogHeader>
    <div className="flex-1 overflow-y-auto min-h-0 px-4">
      <ImagePreview imageUrl={imageUrl} />
    </div>
    <div className="flex gap-4 justify-center p-4 mt-4 border-t border-white/10">
      <DownloadButton imageUrl={imageUrl} fileName={fileName} />
      <CopyButton imageUrl={imageUrl} />
    </div>
  </DialogContent>
);

// Helper components
const SpinnerIcon = () => (
  <svg
    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

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
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const DownloadButton = ({ imageUrl, fileName }: { imageUrl: string; fileName: string }) => (
  <button
    onClick={() => {
      const link = document.createElement("a");
      link.download = fileName;
      link.href = imageUrl;
      link.click();
    }}
    className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 mr-2"
      viewBox="0 0 20 20"
      fill="currentColor">
      <path
        fillRule="evenodd"
        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
    Save Image
  </button>
);

const CopyButton = ({ imageUrl }: { imageUrl: string }) => (
  <button
    onClick={async () => {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const item = new ClipboardItem({
          [blob.type]: blob
        });
        await navigator.clipboard.write([item]);
        toast.success("Image copied to clipboard");
      } catch (error) {
        console.error('Failed to copy image:', error);
        toast.error("Could not copy image to clipboard");
      }
    }}
    className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 mr-2"
      viewBox="0 0 20 20"
      fill="currentColor">
      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
    </svg>
    Copy
  </button>
);

export default ShareableImage;
