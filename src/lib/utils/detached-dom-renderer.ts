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
  let root: ReactDOM.Root | null = null;

  // Add these styles to ensure proper rendering in Chrome
  Object.assign(container.style, {
    position: "fixed", // Changed from absolute
    left: "-9999",
    top: "-9999",
    width: options.width ? `${options.width}px` : "1080px",
    height: options.height ? `${options.height}px` : "1920px",
    overflow: "hidden",
    opacity: "1",
    pointerEvents: "none",
    zIndex: "999999", // Changed to ensure visibility
    backgroundColor: "#ffffff", // Set white background
    margin: "0",
    padding: "0",
    border: "none",
    transform: "none",
    display: "block",
    visibility: "visible",
  });

  // Add to document body temporarily
  document.body.appendChild(container);

  try {
    root = ReactDOM.createRoot(container);

    let componentProps = { ...props };
    if (Component.name === "ShareImageTemplate" || Component.displayName === "ShareImageTemplate") {
      componentProps = {
        ...componentProps,
        imageMode: true,
      } as P;
    }

    const element = React.createElement(Component, componentProps);

    // Render and wait for completion
    await new Promise<void>((resolve) => {
      root?.render(element);
      setTimeout(resolve, 500); // Increased wait time for rendering
    });

    // Wait for images to load
    const images = Array.from(container.querySelectorAll('img, [style*="background-image"]'));
    await Promise.all(
      images.map(
        (element) =>
          new Promise<void>((resolve) => {
            if (element instanceof HTMLImageElement) {
              if (!element.src || element.complete) {
                resolve();
                return;
              }
              element.crossOrigin = "anonymous";
              element.onload = () => resolve();
              element.onerror = () => resolve();
            } else {
              const style = window.getComputedStyle(element);
              const bgImage = style.backgroundImage;
              if (bgImage && bgImage !== "none") {
                const url = bgImage.slice(4, -1).replace(/"/g, "");
                if (!url) {
                  resolve();
                  return;
                }
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => resolve();
                img.onerror = () => resolve();
                img.src = url;
              }
              resolve();
            }
          })
      )
    );

    // Capture with html2canvas
    const canvas = await html2canvas(container, {
      scale: options.scale || 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: true,
      width: options.width || 1080,
      height: options.height || 1920,
      foreignObjectRendering: false, // Changed to false for better compatibility
      removeContainer: false,
      onclone: (clonedDoc, clonedElement) => {
        clonedElement.style.visibility = "visible";
        clonedElement.style.opacity = "1";
        const images = clonedElement.querySelectorAll("img, [style*='background-image']");
        images.forEach((img: Element) => {
          if (img instanceof HTMLImageElement) {
            img.crossOrigin = "anonymous";
            img.style.opacity = "1";
            img.style.visibility = "visible";
          }
        });
      },
    });

    return canvas.toDataURL("image/png");
  } finally {
    if (root) {
      root.unmount();
    }
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
};
