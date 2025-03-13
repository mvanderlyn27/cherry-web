import React, { useState } from "react";
import { Question, QuizAnswers, QuizProps } from "./types";
import FormWizard from "./FormWizard";
import MultipleChoice from "./MultipleChoice";
import ImageChoice from "./ImageChoice";

/**
 * Quiz component provides a reusable template for creating quizzes
 * It handles quiz state, navigation, and rendering the appropriate question components
 */
export const Quiz = ({ questions, onFinished, initialStep = 1, initialAnswers = {} }: QuizProps) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>(initialAnswers);

  const totalSteps = questions.length;

  const handleOptionSelect = (value: string) => {
    const currentQuestion = questions[currentStep - 1];
    setQuizAnswers({
      ...quizAnswers,
      [currentQuestion.id]: value,
    });

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onFinished(quizAnswers);
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
          return question.type === "multipleChoice" ? (
            <MultipleChoice
              key={question.id}
              question={question.question}
              options={question.options}
              onSelect={handleOptionSelect}
              selectedValue={quizAnswers[question.id]}
            />
          ) : (
            <ImageChoice
              key={question.id}
              question={question.question}
              options={question.options}
              onSelect={handleOptionSelect}
              selectedValue={quizAnswers[question.id]}
            />
          );
        }
        return null;
      })}

      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`px-6 py-2 rounded-full font-[Comme] text-sm transition-all duration-300 ${
            currentStep === 1
              ? "bg-white/20 text-white/50 cursor-not-allowed"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}>
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={!quizAnswers[questions[currentStep - 1].id]}
          className={`px-6 py-2 rounded-full font-[Comme] text-sm transition-all duration-300 ${
            !quizAnswers[questions[currentStep - 1].id]
              ? "bg-white/20 text-white/50 cursor-not-allowed"
              : "bg-white text-[#B87CED] hover:shadow-[0_0_10px_rgba(168,85,247,0.5)]"
          }`}>
          {currentStep < totalSteps ? "Next" : "See Results"}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
