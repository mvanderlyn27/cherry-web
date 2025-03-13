// Common types for quiz components

export interface Option {
  label: string;
  value: string;
  image?: string;
}

export interface Question {
  id: string;
  type: "multipleChoice" | "imageChoice";
  question: string;
  options: Option[];
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
