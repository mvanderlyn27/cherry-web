import React from "react";
import { ImageChoiceProps } from "./types";

/**
 * ImageChoice component displays a question with image-based options
 */
export const ImageChoice = ({ question, options, onSelect, selectedValue }: ImageChoiceProps) => {
  return (
    <div className="w-full animate-fadeIn">
      <h3 className="text-xl md:text-2xl text-white font-[Kaisei_Decol] mb-6 text-center">{question}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => onSelect(option.value)}
            className={`cursor-pointer relative group animate-scaleIn ${
              selectedValue === option.value ? "ring-2 ring-pink-300" : ""
            }`}
            style={{ animationDelay: `${index * 100}ms` }}>
            <img
              src={option.image}
              alt={option.label}
              className="w-full aspect-square object-cover rounded-lg transition-all duration-300 group-hover:opacity-90 group-hover:scale-105"
            />
            <div
              className={`absolute inset-0 flex items-center justify-center ${
                selectedValue === option.value ? "bg-black/60" : "bg-black/40 opacity-0 group-hover:opacity-100"
              } transition-opacity duration-300 rounded-lg`}>
              <span className="text-white font-[Comme]">{option.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageChoice;
