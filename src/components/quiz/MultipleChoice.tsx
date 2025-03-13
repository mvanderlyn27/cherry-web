import React from "react";
import { MultipleChoiceProps } from "./types";

/**
 * MultipleChoice component displays a question with multiple choice options
 */
export const MultipleChoice = ({ question, options, onSelect, selectedValue }: MultipleChoiceProps) => {
  return (
    <div className="w-full animate-fadeIn">
      <h3 className="text-xl md:text-2xl text-white font-[Kaisei_Decol] mb-6 text-center">{question}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(option.value)}
            className={`${
              selectedValue === option.value ? "bg-purple-400/50" : "bg-white/10"
            } backdrop-blur-sm text-white p-4 rounded-lg hover:bg-white/20 transition-all duration-300 text-left font-[Comme] animate-scaleIn`}
            style={{ animationDelay: `${index * 100}ms` }}>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoice;
