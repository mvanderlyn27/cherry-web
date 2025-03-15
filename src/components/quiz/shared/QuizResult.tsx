import React, { useState, useEffect, useRef } from "react";
import { QuizResultProps } from "../types";
import ShareLink from "./ShareLink";
import ShareableImage from "./ShareableImage";
import ShareImageTemplate from "./ShareImageTemplate";

export const QuizResult = ({
  resultTitle = "Your Results",
  resultImage,
  resultDescription,
  onPrimaryAction,
  primaryActionText = "Read More",
  onRestart,
  userName,
}: QuizResultProps) => {
  const templateRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const viewportWidth = window.innerWidth;
      const widthScale = (viewportWidth * 0.8) / 1080; // 80% of viewport width
      setScale(Math.min(widthScale, 0.5)); // Cap at 0.5 for readability
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Calculate the scaled dimensions
  const scaledWidth = 1080 * scale;
  const scaledHeight = 1920 * scale;

  return (
    <div className="w-full  overflow-hidden animate-fadeIn">
      <div className="bg-white/10 backdrop-blur-sm p-4 md:p-6 rounded-lg mb-6">
        {/* Container with explicit dimensions matching the scaled content */}
        <div
          className="relative  mx-auto rounded-lg overflow-hidden"
          style={{
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
          }}>
          {/* The template with transform scale */}
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              width: "1080px",
              height: "1920px",
            }}>
            <ShareImageTemplate
              ref={templateRef}
              title={`${userName ? userName + "'s" : "Your"} Book Soulmate is...`}
              imageSrc={resultImage || ""}
              mainTitle={resultTitle}
              description={resultDescription || ""}
              websiteUrl="cherryromance.vercel.app"
              userName={userName}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="border-t border-white/20 mt-6 pt-6">
          <div className="flex flex-wrap justify-center gap-4">
            {onRestart && (
              <button
                onClick={onRestart}
                className="flex items-center font-[Comme] text-sm cursor-pointer bg-white/10 text-white px-6 py-2 rounded-full transition-all duration-300 hover:bg-white/20">
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Retry
              </button>
            )}
            {/* <ShareLink title="Cherry - Discover Your Type" text="Find out what kind of man is your perfect match!" /> */}
            {resultImage && resultTitle && (
              <ShareableImage
                title={`${userName ? userName + "'s" : "Your"} Book Soulmate is...`}
                imageSrc={resultImage}
                mainTitle={resultTitle}
                description={resultDescription || ""}
                fileName="cherry-quiz-result.png"
                userName={userName}
                templateRef={templateRef as React.RefObject<HTMLDivElement>}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
