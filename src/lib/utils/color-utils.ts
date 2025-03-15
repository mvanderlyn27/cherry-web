import { FastAverageColor } from "fast-average-color";

interface ColorResult {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  isDark: boolean;
}

/**
 * Extracts dominant colors from an image and returns a color palette
 * @param imageSrc - URL or data URL of the image
 * @returns Promise with color palette information
 */
export const extractColorsFromImage = async (imageSrc: string): Promise<ColorResult> => {
  try {
    const fac = new FastAverageColor();

    // Create an image element to analyze
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageSrc;

    // Wait for the image to load
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;

      // Set a timeout in case the image takes too long to load
      setTimeout(resolve, 3000);
    });

    // Get the dominant color
    const color = await fac.getColor(img);

    // Generate a complementary color for secondary elements
    const primaryColor = color.hex;
    const rgbColor = color.value;

    // Create a contrasting secondary color by shifting hue and adjusting brightness
    const [r, g, b] = rgbColor;
    const [h, s, l] = rgbToHsl(r, g, b);

    // Shift hue by 180 degrees for maximum contrast
    const newHue = (h + 180) % 360;
    // Adjust saturation and lightness for better contrast
    const newSat = Math.min(100, s + 20);
    const newLight = l < 50 ? Math.min(90, l + 40) : Math.max(10, l - 40);

    const [sr, sg, sb] = hslToRgb(newHue, newSat, newLight);
    const secondaryColor = `rgb(${sr}, ${sg}, ${sb})`;

    // Determine if we should use light or dark text based on background brightness
    const isDark = color.isDark;

    return {
      primaryColor,
      secondaryColor,
      textColor: isDark ? "#ffffff" : "#000000",
      isDark,
    };
  } catch (error) {
    console.error("Error extracting colors from image:", error);

    // Return default colors if extraction fails
    return {
      primaryColor: "#F9A8D4",
      secondaryColor: "#B87CED",
      textColor: "#ffffff",
      isDark: true,
    };
  }
};

// Convert RGB to HSL
const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
};

// Convert HSL to RGB
const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

/**
 * Creates a gradient string for CSS based on primary and secondary colors
 * @param primaryColor - The primary color in hex or rgb format
 * @param secondaryColor - The secondary color in hex or rgb format
 * @returns CSS gradient string
 */
export const createGradient = (primaryColor: string, secondaryColor: string): string => {
  return `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${primaryColor} 100%)`;
};

/**
 * Adjusts color opacity
 * @param color - Color in hex format (#RRGGBB)
 * @param opacity - Opacity value between 0 and 1
 * @returns RGBA color string
 */
export const adjustColorOpacity = (color: string, opacity: number): string => {
  // If color is already in rgba format, just adjust the opacity
  if (color.startsWith("rgba")) {
    return color.replace(/[\d\.]+\)$/, `${opacity})`);
  }

  // If color is in rgb format, convert to rgba
  if (color.startsWith("rgb(")) {
    return color.replace("rgb(", "rgba(").replace(")", `, ${opacity})`);
  }

  // Handle hex colors
  if (color.startsWith("#")) {
    let r, g, b;

    // #RGB format
    if (color.length === 4) {
      r = parseInt(color[1] + color[1], 16);
      g = parseInt(color[2] + color[2], 16);
      b = parseInt(color[3] + color[3], 16);
    }
    // #RRGGBB format
    else {
      r = parseInt(color.slice(1, 3), 16);
      g = parseInt(color.slice(3, 5), 16);
      b = parseInt(color.slice(5, 7), 16);
    }

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  // Default fallback
  return color;
};
