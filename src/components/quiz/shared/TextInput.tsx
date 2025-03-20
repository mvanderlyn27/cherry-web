import React, { useState } from "react";

interface TextInputProps {
  question: string;
  onSubmit: (value: string, next: boolean) => void;
  placeholder?: string;
  initialValue?: string;
}

export const TextInput = ({
  question,
  onSubmit,
  placeholder = "Type your answer here...",
  initialValue = "",
}: TextInputProps) => {
  const [value, setValue] = useState(initialValue);
  return (
    <div className="w-full animate-fadeIn">
      <h3 className="text-xl md:text-2xl text-white font-['SansitaOne'] mb-4 md:mb-6 text-center">{question}</h3>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onSubmit(e.target.value, false);
        }}
        placeholder={placeholder}
        className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-lg placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#DE4447] mb-4"
      />
    </div>
  );
};

export default TextInput;
