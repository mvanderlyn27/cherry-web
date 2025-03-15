import React from "react";
import ReactDOM from "react-dom/client";
import html2canvas from "html2canvas-pro";

/**
 * Creates a detached DOM element, renders a React component into it,
 * captures it with html2canvas, and then cleans up.
 *
 * @param Component The React component to render
 * @param props Props to pass to the component
 * @param options Additional options for html2canvas
 * @returns Promise resolving to a data URL of the captured image
 */
export const renderComponentToImage = async <P extends object>(
  Component: React.ComponentType<P>,
  props: P,
  options: {
    width?: number;
    height?: number;
    scale?: number;
    backgroundColor?: string | null;
  } = {}
): Promise<string> => {
  // Create a detached container element
  const container = document.createElement("div");

  // Set necessary styles for rendering but keep it out of the visible document
  Object.assign(container.style, {
    position: "absolute",
    left: "-9999px",
    top: "-9999px",
    width: options.width ? `${options.width}px` : "1080px",
    height: options.height ? `${options.height}px` : "1920px",
    overflow: "hidden",
    opacity: "1", // Changed from 0 to ensure visibility during capture
    pointerEvents: "none",
    zIndex: "-1000",
    backgroundColor: options.backgroundColor || "#ffffff", // Ensure white background if not specified
    margin: "0",
    padding: "0",
    border: "none",
    transform: "none",
    display: "block", // Ensure the container is displayed
    visibility: "visible", // Explicitly set visibility
  });

  // Add to document body temporarily
  document.body.appendChild(container);

  try {
    // Create root and render the component using modern React API
    const root = ReactDOM.createRoot(container);

    // If the component is ShareImageTemplate, ensure it uses fixed mode
    let componentProps = { ...props };
    if (Component.name === "ShareImageTemplate" || Component.displayName === "ShareImageTemplate") {
      componentProps = { ...componentProps, mode: "fixed" } as P;
    }

    const element = React.createElement(Component, componentProps);
    await new Promise<void>((resolve) => {
      root.render(element);
      // Use requestAnimationFrame to ensure the component is rendered
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });

    // Force a repaint and wait for images to load
    container.getBoundingClientRect();

    // Find all images in the container and ensure they're loaded
    const images = Array.from(container.getElementsByTagName("img"));
    await Promise.all(
      images.map(
        (img) =>
          new Promise<void>((resolve, reject) => {
            if (img.complete) {
              resolve();
            } else {
              img.crossOrigin = "anonymous"; // Ensure CORS is set before loading
              img.onload = () => resolve();
              img.onerror = () => {
                console.warn(`Failed to load image: ${img.src}`);
                resolve(); // Continue anyway
              };
            }
          })
      )
    );

    // Wait a moment for everything to render properly
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log("Capturing detached element with dimensions:", {
      width: container.offsetWidth,
      height: container.offsetHeight,
      children: container.children.length,
      images: images.length,
    });

    // Capture with html2canvas
    const canvas = await html2canvas(container, {
      scale: options.scale || 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: options.backgroundColor || "#ffffff",
      logging: true,
      width: options.width || 1080,
      height: options.height || 1920,
      onclone: (clonedDoc, clonedElement) => {
        console.log("Element cloned for capture", {
          width: clonedElement.offsetWidth,
          height: clonedElement.offsetHeight,
          children: clonedElement.children.length,
        });

        // Pre-process all images in the clone
        const images = clonedElement.querySelectorAll("img");
        images.forEach((img) => {
          // Set crossOrigin before the image starts loading
          img.crossOrigin = "anonymous";
          img.style.opacity = "1";
          img.style.visibility = "visible";
          img.style.display = "block";

          // Force reload the image with CORS if not already loaded
          if (!img.complete) {
            const originalSrc = img.src;
            img.src = "";
            img.src = originalSrc;
          }
        });

        // Apply additional styles to ensure proper rendering
        Object.assign(clonedElement.style, {
          transform: "none",
          perspective: "none",
          backfaceVisibility: "visible",
          WebkitFontSmoothing: "antialiased",
          opacity: "1",
          visibility: "visible",
          display: "block",
          backgroundColor: options.backgroundColor || "#ffffff",
        });
      },
    });

    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Error rendering component to image:", error);
    throw error;
  } finally {
    // Clean up: unmount component and remove container
    try {
      const root = ReactDOM.createRoot(container);
      root.unmount();
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    } catch (cleanupError) {
      console.error("Error during cleanup:", cleanupError);
    }
  }
};
