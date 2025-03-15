import React, { useState } from "react";
import { toast } from "sonner";

interface ShareLinkProps {
  title?: string;
  text?: string;
  url?: string;
  className?: string;
}

/**
 * ShareLink component handles sharing functionality and displays toast notifications
 * instead of alerts when sharing is successful or fails
 */
export const ShareLink = ({
  title = "Cherry - Discover Your Soulmate",
  text = "Find out which Book Boyfriend is your Soulmate!",
  url,
  className = "flex items-center font-[Comme] text-sm cursor-pointer bg-white/10 text-white px-6 py-2 rounded-full transition-all duration-300 hover:bg-white/20",
}: ShareLinkProps) => {
  const handleShare = () => {
    // Use the current URL if none provided
    const shareUrl = url || window.location.href;

    // Try to use the Web Share API if available
    if (navigator.share) {
      navigator
        .share({
          title,
          text,
          url: shareUrl,
        })
        .then(() => {
          // Show success toast
          toast("Link Shared!");
        })
        .catch((error) => {
          // Show error toast if user cancels or sharing fails
          if (error.name !== "AbortError") {
            toast("Failed to share. Please try again.");
            // Fallback to clipboard
            copyToClipboard(shareUrl);
          }
        });
    } else {
      // Fallback for browsers that don't support the Web Share API
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast("Link copied! Share with your friends");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
        toast("Failed to copy link. Please try again.");
      });
  };

  return (
    <>
      <button onClick={handleShare} className={className}>
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
        Share Link
      </button>
    </>
  );
};

export default ShareLink;
