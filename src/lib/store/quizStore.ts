import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QuizAnswers } from '../../components/quiz/types';

// Define the quiz store state interface
interface QuizState {
  // Quiz progress
  currentStep: number;
  quizAnswers: QuizAnswers;
  showResult: boolean;
  isLoading: boolean;
  
  // Quiz results
  manType: string;
  manImage: string;
  manDescription: string;
  userName: string;
  adjective1: string;
  adjective2: string;
  maxChar: string;
  
  // Actions
  setCurrentStep: (step: number) => void;
  setQuizAnswers: (answers: QuizAnswers) => void;
  setShowResult: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setManType: (type: string) => void;
  setManImage: (image: string) => void;
  setManDescription: (description: string) => void;
  setUserName: (name: string) => void;
  setAdjective1: (adj: string) => void;
  setAdjective2: (adj: string) => void;
  setMaxChar: (char: string) => void;
  
  // Bulk actions
  storeResults: (results: {
    answers: QuizAnswers;
    manType: string;
    manImage: string;
    manDescription: string;
    adjective1: string;
    adjective2: string;
    maxChar: string;
    userName: string;
  }) => void;
  resetQuiz: () => void;
}

// Create the quiz store with persistence
export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      // Initial state
      currentStep: 1,
      quizAnswers: {},
      showResult: false,
      isLoading: false,
      manType: '',
      manImage: '',
      manDescription: '',
      userName: '',
      adjective1: '',
      adjective2: '',
      maxChar: '',
      
      // Individual setters
      setCurrentStep: (step) => set({ currentStep: step }),
      setQuizAnswers: (answers) => set({ quizAnswers: answers }),
      setShowResult: (show) => set({ showResult: show }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setManType: (type) => set({ manType: type }),
      setManImage: (image) => set({ manImage: image }),
      setManDescription: (description) => set({ manDescription: description }),
      setUserName: (name) => set({ userName: name }),
      setAdjective1: (adj) => set({ adjective1: adj }),
      setAdjective2: (adj) => set({ adjective2: adj }),
      setMaxChar: (char) => set({ maxChar: char }),
      
      // Store all results at once
      storeResults: (results) => set({
        quizAnswers: results.answers,
        manType: results.manType,
        manImage: results.manImage,
        manDescription: results.manDescription,
        adjective1: results.adjective1,
        adjective2: results.adjective2,
        maxChar: results.maxChar,
        userName: results.userName,
      }),
      
      // Reset quiz state
      resetQuiz: () => set({
        quizAnswers: {},
        showResult: false,
        isLoading: false,
        manType: '',
        manImage: '',
        manDescription: '',
        userName: '',
        adjective1: '',
        adjective2: '',
        maxChar: '',
      }),
    }),
    {
      name: 'cherry-quiz-storage', // localStorage key
    }
  )
);
