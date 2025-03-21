import React from "react";
import { Question, QuizAnswers, QuizProps } from "../types";
import FormWizard from "./FormWizard";
import MultipleChoice from "./MultipleChoice";
import ImageChoice from "./ImageChoice";
import { TextInput } from "./index";
import MultiSelect from "./MultiSelect";
import { useQuizStore } from "../../../lib/store/quizStore";

export const Quiz = ({ questions, onFinished, initialStep = 1, initialAnswers = {} }: QuizProps) => {
  const { currentStep, setCurrentStep, quizAnswers, setQuizAnswers } = useQuizStore();

  const totalSteps = questions.length;

  const handleOptionSelect = (value: string, next: boolean = true) => {
    const currentQuestion = questions[currentStep - 1];
    const updatedAnswers = { ...quizAnswers, [currentQuestion.id]: value };
    setQuizAnswers(updatedAnswers);

    if (next) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        // Ensure the state is updated before calling onFinished
        onFinished(updatedAnswers);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    const currentQuestion = questions[currentStep - 1];
    // Only proceed if this question has been answered
    if (quizAnswers[currentQuestion.id]) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        onFinished(quizAnswers);
      }
    }
  };

  return (
    <div>
      <FormWizard currentStep={currentStep} totalSteps={totalSteps} />

      {questions.map((question, index) => {
        if (index + 1 === currentStep) {
          if (question.type === "multipleChoice") {
            return (
              <MultipleChoice
                key={question.id}
                question={question.question}
                options={question.options || []}
                onSelect={handleOptionSelect}
                selectedValue={quizAnswers[question.id]}
              />
            );
          } else if (question.type === "imageChoice") {
            return (
              <ImageChoice
                key={question.id}
                question={question.question}
                options={question.options || []}
                onSelect={handleOptionSelect}
                selectedValue={quizAnswers[question.id]}
                allowMultiple={question.allowMultiple}
              />
            );
          } else if (question.type === "textInput") {
            return (
              <TextInput
                key={question.id}
                question={question.question}
                placeholder={question.placeholder}
                initialValue={quizAnswers[question.id] || ""}
                onSubmit={handleOptionSelect}
              />
            );
          } else if (question.type === "multiSelect") {
            return (
              <MultiSelect
                key={question.id}
                question={question.question}
                options={question.options || []}
                onSelect={handleOptionSelect}
                selectedValue={quizAnswers[question.id] || ""}
                maxSelections={question.maxSelections}
              />
            );
          }
        }
        return null;
      })}

      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`px-6 py-2 rounded-full font-[Comme] text-sm transition-all duration-300 ${
            currentStep === 1
              ? "bg-[#542E2F]/20 text-[#542E2F]/50 cursor-not-allowed"
              : "bg-[#542E2F]/10 text-[#542E2F] hover:bg-[#542E2F]/20"
          }`}>
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={!quizAnswers[questions[currentStep - 1].id]}
          className={`px-6 py-2 rounded-full font-[Comme] text-sm transition-all duration-300 ${
            !quizAnswers[questions[currentStep - 1].id]
              ? "bg-[#542E2F]/20 text-[#542E2F]/50 cursor-not-allowed"
              : "bg-white text-[#E96F71] hover:shadow-[0_0_10px_rgba(222, 68, 71,0.5)]"
          }`}>
          {currentStep < totalSteps ? "Next" : "See Results"}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
