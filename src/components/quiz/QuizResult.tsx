import React, { useState, useEffect } from "react";
import { QuizResultProps } from "./types";
import ShareLink from "./ShareLink";
import ShareableImage from "./ShareableImage";

/**
 * QuizResult component displays the results of a quiz with customizable content and actions
 */
export const QuizResult = ({
  result,
  resultTitle = "Your Results",
  resultImage,
  resultDescription,
  onPrimaryAction,
  primaryActionText = "Read More",
  onRestart,
}: QuizResultProps) => {
  const [visibleText, setVisibleText] = useState<string>("");

  useEffect(() => {
    if (result) {
      // Show first two paragraphs to demonstrate blur effect
      const paragraphs = result.split("\n\n");
      const visibleParagraphs = paragraphs.slice(0, 2).join("\n\n");
      setVisibleText(visibleParagraphs);
    }
  }, [result]);

  return (
    <div className="w-full animate-fadeIn">
      <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg mb-6">
        <h2 className="text-2xl md:text-3xl text-white font-[Kaisei_Decol] mb-6 text-center">{resultTitle}</h2>
        {resultImage && resultDescription && (
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="md:w-1/3">
              <img src={resultImage} alt={resultTitle} className="w-full aspect-square object-cover rounded-lg" />
            </div>
            <div className="md:w-2/3">
              <p className="text-white font-[Comme]">{resultDescription}</p>
            </div>
          </div>
        )}

        {result && (
          <div className={`${resultImage && resultDescription ? "border-t border-white/20 pt-6" : ""}`}>
            <h3 className="text-xl text-pink-200 font-[Kaisei_Decol] mb-3">Your Love Story</h3>
            <div className="relative">
              <p className="text-white font-[Comme] mb-4">{visibleText.substring(0, 500) + "..."}</p>
              <div className="h-48 bg-gradient-to-b from-transparent to-black/90 absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-6">
                <button
                  onClick={() => (window.location.href = "/")}
                  className="font-[Comme] text-sm cursor-pointer bg-white text-[#B87CED] px-8 py-3 rounded-full transition-all duration-700 animate-[pulse-glow_2s_ease-in-out_infinite] hover:pause-animation hover:shadow-[0_0_20px_3px_rgba(168,85,247,0.7)] hover:scale-105">
                  {primaryActionText}
                </button>
              </div>
            </div>
          </div>
        )}

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
                Restart Quiz
              </button>
            )}
            <ShareLink title="Cherry - Discover Your Type" text="Find out what kind of man is your perfect match!" />
            {resultImage && resultTitle && (
              <ShareableImage
                title="My Type of Man"
                imageSrc={resultImage}
                mainTitle={resultTitle}
                description={resultDescription || ""}
                fileName="cherry-quiz-result.png"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
