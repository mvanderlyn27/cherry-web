// Common types for quiz components

export interface Option {
  label: string;
  value: string;
  image?: string;
}

// Add 'textInput' to the question types
export type QuestionType = "multipleChoice" | "imageChoice" | "textInput" | "multiSelect";

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: Option[];
  placeholder?: string;
  maxSelections?: number; // For multiSelect questions
  allowMultiple?: boolean; // For imageChoice questions that allow multiple selections
}

export interface QuizAnswers {
  [key: string]: string;
}

export interface FormWizardProps {
  currentStep: number;
  totalSteps: number;
}

export interface MultipleChoiceProps {
  question: string;
  options: Option[];
  onSelect: (value: string) => void;
  selectedValue?: string;
}

export interface ImageChoiceProps {
  question: string;
  options: Option[];
  onSelect: (value: string) => void;
  selectedValue?: string;
}

export interface QuizResultProps {
  result: string;
  resultTitle?: string;
  resultImage?: string;
  resultDescription?: string;
  onPrimaryAction?: () => void;
  primaryActionText?: string;
  onRestart?: () => void;
  onShareLink?: () => void;
  onShareResults?: () => void;
}

export interface QuizProps {
  questions: Question[];
  onFinished: (answers: QuizAnswers) => void;
  initialStep?: number;
  initialAnswers?: QuizAnswers;
}
