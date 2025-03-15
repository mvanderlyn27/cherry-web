import html2canvas from "html2canvas-pro";

interface GenerateShareImageParams {
  imageSrc: string;
  title: string;
  mainTitle: string;
  description: string;
  websiteUrl: string;
  userName?: string;
}

export const generateShareImageFromHTML = async (
  containerRef: React.RefObject<HTMLDivElement>,
  params: GenerateShareImageParams
): Promise<string> => {
  if (!containerRef.current) {
    throw new Error("Container ref is not available");
  }

  try {
    // Ensure the container is fully visible during capture
    const originalStyles = {
      position: containerRef.current.style.position,
      left: containerRef.current.style.left,
      top: containerRef.current.style.top,
      opacity: containerRef.current.style.opacity,
      zIndex: containerRef.current.style.zIndex,
      pointerEvents: containerRef.current.style.pointerEvents,
    };

    // Make the container fully visible for html2canvas
    containerRef.current.style.position = "fixed";
    containerRef.current.style.left = "0";
    containerRef.current.style.top = "0";
    containerRef.current.style.opacity = "1"; // Make fully visible for capture
    containerRef.current.style.zIndex = "9999";
    containerRef.current.style.pointerEvents = "none";

    // Force a repaint to ensure styles are applied
    containerRef.current.getBoundingClientRect();

    // Wait a moment for the styles to be applied
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log("Capturing element with dimensions:", {
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
      children: containerRef.current.children.length,
    });

    // Render the HTML to canvas with improved options
    const canvas = await html2canvas(containerRef.current, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Allow cross-origin images
      allowTaint: true,
      backgroundColor: null, // Let the background from the HTML show through
      logging: true, // Enable logging for debugging
      width: 1080,
      height: 1920,
      onclone: (clonedDoc, clonedElement) => {
        console.log("Element cloned for capture", {
          width: clonedElement.offsetWidth,
          height: clonedElement.offsetHeight,
          children: clonedElement.children.length,
        });

        // Ensure all images are loaded in the clone
        const images = clonedElement.querySelectorAll("img");
        images.forEach((img) => {
          if (img.complete) {
            console.log("Image already loaded:", img.src);
          } else {
            console.log("Image not yet loaded:", img.src);
          }
        });
      },
    });

    // Restore original styles
    Object.entries(originalStyles).forEach(([key, value]) => {
      containerRef.current.style[key as any] = value as string;
    });

    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Error generating share image:", error);
    throw error;
  }
};
