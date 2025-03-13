import React, { useState } from "react";

interface TextInputProps {
  question: string;
  onSubmit: (value: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export const TextInput = ({ question, onSubmit, placeholder = "Type your answer here...", initialValue = "" }: TextInputProps) => {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value);
    }
  };

  return (
    <div className="w-full animate-fadeIn">
      <h3 className="text-xl md:text-2xl text-white font-[Kaisei_Decol] mb-6 text-center">{question}</h3>
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-lg placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#B87CED] mb-4"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="w-full bg-[#B87CED] text-white py-3 rounded-lg hover:bg-[#A66BD8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          Continue
        </button>
      </form>
    </div>
  );
};

export default TextInput;