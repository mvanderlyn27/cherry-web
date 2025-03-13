interface GenerateShareImageParams {
  imageSrc: string;
  title: string;
  mainTitle: string;
  description: string;
  websiteUrl: string;
}

export const generateShareImage = async ({
  imageSrc,
  title,
  mainTitle,
  description,
  websiteUrl,
}: GenerateShareImageParams): Promise<string> => {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas context not available");

  // Draw background and basic elements
  drawBackground(ctx, canvas);
  drawHeader(ctx, canvas, title);

  // Load and draw main image
  await drawMainImage(ctx, canvas, imageSrc);

  // Draw text elements
  drawMainTitle(ctx, canvas, mainTitle);
  const descriptionEndY = drawDescription(ctx, canvas, description);
  drawWebsite(ctx, canvas, websiteUrl, descriptionEndY);

  return canvas.toDataURL("image/png");
};

// Draw modern gradient background with texture
const drawBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#1a1a1a"); // Dark gray
  gradient.addColorStop(0.7, "#0f0f0f"); // Near black
  gradient.addColorStop(1, "#000000"); // Pure black
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add subtle texture overlay
  ctx.globalAlpha = 0.03;
  for (let i = 0; i < canvas.width; i += 30) {
    for (let j = 0; j < canvas.height; j += 30) {
      if (Math.random() > 0.5) {
        ctx.beginPath();
        ctx.arc(i, j, 1, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
      }
    }
  }
  ctx.globalAlpha = 1.0;

  // Add a subtle purple glow at the top
  const topGlow = ctx.createRadialGradient(canvas.width / 2, 200, 0, canvas.width / 2, 200, canvas.width * 0.8);
  topGlow.addColorStop(0, "rgba(184, 124, 237, 0.2)"); // Purple with transparency
  topGlow.addColorStop(1, "rgba(184, 124, 237, 0)");
  ctx.fillStyle = topGlow;
  ctx.fillRect(0, 0, canvas.width, 600);
};

// Draw header with title
const drawHeader = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, title: string) => {
  // Draw Cherry logo/branding
  ctx.fillStyle = "#F9A8D4"; // Pink
  ctx.font = "italic 40px 'Arial'";
  ctx.textAlign = "center";
  ctx.fillText("Cherry: Romance Stories", canvas.width / 2, 150); // Increased from 120

  // Draw title with glow
  ctx.shadowColor = "rgba(249, 168, 212, 0.6)";
  ctx.shadowBlur = 25;
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 90px 'Arial'";
  ctx.fillText(title, canvas.width / 2, 260); // Increased from 220
  ctx.shadowBlur = 0;
};

// Draw main image with circular mask and glow
const drawMainImage = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, imageSrc: string) => {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const imgSize = 600;
      const centerX = canvas.width / 2;
      const centerY = 625; // Increased from 550 to move image down
      const radius = imgSize / 2;

      // Calculate scaling to cover the circle while maintaining aspect ratio
      const scale = Math.max(imgSize / img.width, imgSize / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const offsetX = (scaledWidth - imgSize) / 2;
      const offsetY = (scaledHeight - imgSize) / 2;

      // Draw pink glow behind image
      ctx.shadowColor = "rgba(249, 168, 212, 1)";
      ctx.shadowBlur = 50;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw image with circular mask
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(
        img,
        centerX - radius - offsetX + 2,
        centerY - radius - offsetY + 2,
        scaledWidth - 4,
        scaledHeight - 4
      );
      ctx.restore();

      resolve();
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
    img.src = imageSrc;
  });
};

// Draw main title with enhanced glow effect
const drawMainTitle = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, mainTitle: string) => {
  ctx.shadowColor = "rgba(184, 124, 237, 0.8)";
  ctx.shadowBlur = 30;
  ctx.fillStyle = "#B87CED"; // Purple
  ctx.font = "bold 100px 'Arial'";
  ctx.textAlign = "center";
  ctx.fillText(mainTitle, canvas.width / 2, 1050); // Increased from 1000

  // Add decorative line with enhanced gradient
  const lineGradient = ctx.createLinearGradient(canvas.width * 0.2, 0, canvas.width * 0.8, 0);
  lineGradient.addColorStop(0, "rgba(184, 124, 237, 0)");
  lineGradient.addColorStop(0.5, "rgba(184, 124, 237, 0.6)");
  lineGradient.addColorStop(1, "rgba(184, 124, 237, 0)");
  ctx.fillStyle = lineGradient;
  ctx.fillRect(canvas.width * 0.2, 1110, canvas.width * 0.6, 3); // Increased from 1050
};

// Draw description with text wrapping
const drawDescription = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, description: string): number => {
  const wrapText = (text: string, maxWidth: number, startY: number, lineHeight: number): number => {
    const words = text.split(" ");
    let line = "";
    let y = startY;

    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.font = "500 42px Arial";
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 3;
    ctx.textAlign = "left"; // Change text alignment for description

    for (let word of words) {
      const testLine = line + word + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && line !== "") {
        ctx.fillText(line, canvas.width / 2 - maxWidth / 2, y); // Adjust x position for left alignment
        line = word + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, canvas.width / 2 - maxWidth / 2, y); // Adjust x position for left alignment

    ctx.textAlign = "center"; // Reset text alignment for subsequent text
    return y;
  };

  return wrapText(description, 800, 1200, 65); // Increased Y from 1150 and line height from 60
};

// Draw website URL and call-to-action
const drawWebsite = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  websiteUrl: string,
  descriptionEndY: number
) => {
  // Add "Find yours at:" text with enhanced styling
  ctx.shadowColor = "rgba(249, 168, 212, 0.4)";
  ctx.shadowBlur = 8;
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.font = "italic 36px 'Arial'";
  ctx.fillText("Find yours at:", canvas.width / 2, descriptionEndY + 150); // Increased from 120

  // Add website URL with enhanced glowing effect
  ctx.shadowColor = "rgba(249, 168, 212, 0.6)";
  ctx.shadowBlur = 15;
  ctx.fillStyle = "#F9A8D4";
  ctx.font = "bold 44px 'Arial'";
  ctx.fillText(websiteUrl, canvas.width / 2, descriptionEndY + 220); // Increased from 180
  ctx.shadowBlur = 0;
};
