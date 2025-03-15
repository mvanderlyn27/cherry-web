import React from "react";

/**
 * LoadingResults component displays a loading spinner while quiz results are being generated
 */
export const LoadingResults = () => {
  return (
    <div className="w-full animate-fadeIn flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 border-4 border-t-[#B87CED] border-white/30 rounded-full animate-spin mb-4"></div>
      <p className="text-white font-[Comme]">Fetching your results...</p>
    </div>
  );
};

export default LoadingResults;
