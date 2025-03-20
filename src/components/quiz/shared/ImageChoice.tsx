import React, { useState } from "react";
import { Option } from "../types";

/**
 * ImageChoice component displays a question with image-based options
 */
interface ImageChoiceProps {
  question: string;
  options: Option[];
  onSelect: (value: string, next: boolean) => void;
  selectedValue: string;
  allowMultiple?: boolean;
  maxSelections?: number;
}

export const ImageChoice = ({
  question,
  options,
  onSelect,
  selectedValue,
  allowMultiple = false,
  maxSelections = 0,
}: ImageChoiceProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(selectedValue ? selectedValue.split(",") : []);
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    console.log("Current selected options:", selectedOptions);
    console.log("Clicked value:", value);
    if (!allowMultiple) {
      // For single selection, proceed immediately
      onSelect(value, true);
      return;
    }

    // For multiple selection, update only the clicked value
    let newSelected;
    if (selectedOptions.includes(value)) {
      // Remove only the clicked value if it's already selected
      newSelected = selectedOptions.filter((item) => item !== value);
    } else if (!maxSelections || selectedOptions.length < maxSelections) {
      // Add only the clicked value if under max selections
      newSelected = [...selectedOptions, value];
    } else {
      // Replace oldest selection with only the clicked value
      newSelected = [...selectedOptions.slice(1), value];
    }

    setSelectedOptions(newSelected);
    onSelect(newSelected.join(","), false);
  };

  return (
    <div className="w-full animate-fadeIn">
      <h3 className="text-xl md:text-2xl text-white font-['SansitaOne'] mb-4 md:mb-6 text-center">{question}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => handleSelect(option.value)}
            onMouseEnter={() => setHoveredValue(option.value)}
            onMouseLeave={() => setHoveredValue(null)}
            className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${
              (allowMultiple ? selectedOptions.includes(option.value) : selectedValue === option.value)
                ? "ring-4 ring-[#DE4447] scale-[1.02]"
                : "hover:scale-[1.02]"
            }`}>
            <img
              src={option.image}
              alt={option.label}
              className="w-full aspect-square object-cover rounded-lg transition-all duration-300  group-hover:scale-105"
            />
            {/* <div
              className={`absolute inset-0 flex flex-col items-center justify-center gap-2 ${
                (allowMultiple ? selectedOptions.includes(option.value) : selectedValue === option.value)
                  ? "bg-black/60"
                  : "bg-black/40 opacity-0 hover:opacity-100"
              } transition-opacity duration-300 rounded-lg`}>
              <span className="text-white font-[Comme]">{option.label}</span>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageChoice;
