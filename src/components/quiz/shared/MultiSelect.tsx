import React, { useState, useEffect } from "react";
import { Option } from "../types";

interface MultiSelectProps {
  question: string;
  options: Option[];
  onSelect: (value: string, next: boolean) => void;
  selectedValue: string;
  maxSelections?: number;
}

export const MultiSelect = ({ question, options, onSelect, selectedValue, maxSelections = 0 }: MultiSelectProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  useEffect(() => {
    if (selectedValue) {
      setSelectedOptions(selectedValue.split(","));
    }
  }, [selectedValue]);

  const handleOptionToggle = (value: string) => {
    let newSelected;

    if (selectedOptions.includes(value)) {
      newSelected = selectedOptions.filter((item) => item !== value);
    } else {
      if (maxSelections <= 0 || selectedOptions.length < maxSelections) {
        newSelected = [...selectedOptions, value];
      } else {
        newSelected = [...selectedOptions.slice(1), value];
      }
    }

    setSelectedOptions(newSelected);
    onSelect(newSelected.join(","), false); // Call onSelect immediately when options change
  };

  return (
    <div className="w-full animate-fadeIn">
      <h3 className="text-xl md:text-2xl text-white font-['SansitaOne'] mb-4 md:mb-6 text-center">{question}</h3>
      {maxSelections > 0 && (
        <p className="text-white/70 text-sm text-center mb-6">Select up to {maxSelections} options</p>
      )}

      <div className="flex flex-col gap-3">
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => handleOptionToggle(option.value)}
            className={`cursor-pointer p-4 rounded-lg transition-all duration-200 ${
              selectedOptions.includes(option.value)
                ? "bg-[#DE4447] border border-[#DE4447]"
                : "bg-white border border-[#DE4447] hover:scale-105"
            }`}>
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded flex items-center justify-center ${
                  selectedOptions.includes(option.value) ? "border-white bg-white" : "border-[#DE4447] border"
                }`}>
                {selectedOptions.includes(option.value) && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-3 w-3 ${selectedOptions.includes(option.value) ? "text-[#DE4447]" : "text-white"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`${selectedOptions.includes(option.value) ? "text-white" : "text-[#DE4447]"}`}>
                {option.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiSelect;
