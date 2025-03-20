import React from "react";
import { FormWizardProps } from "../types";

/**
 * FormWizard component displays the current progress in a multi-step form
 */
export const FormWizard = ({ currentStep, totalSteps }: FormWizardProps) => {
  // Calculate completion percentage based on completed steps (current step - 1)
  // This makes the first question show 0% until answered
  const completedSteps = currentStep - 1;
  const percentComplete = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[#542E2F]font-[Comme] text-sm">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-[#542E2F] font-[Comme] text-sm">{percentComplete}% Complete</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-2.5">
        <div
          className="bg-[#DE4447] h-2.5 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${percentComplete}%` }}></div>
      </div>
    </div>
  );
};

export default FormWizard;
