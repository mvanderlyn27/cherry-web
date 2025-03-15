import { useEffect } from "react";
import posthog from "posthog-js";
import { useQuizStore } from "../../lib/store/quizStore";
import { QuizUI } from "../../components/quiz/mytype/QuizUI";
import { generateQuizResults } from "../../components/quiz/mytype/resultGenerator";
import { QuizAnswers } from "@/components/quiz/types";

// Main form component

export const MyTypeOfMan = () => {
  const {
    quizAnswers,
    setShowResult,
    setIsLoading,
    setManType,

    storeResults,
  } = useQuizStore();

  // Track quiz page view
  useEffect(() => {
    posthog.capture("quiz_page_view");
  }, []);

  const generateResults = async (answers: QuizAnswers) => {
    setIsLoading(true);
    setShowResult(true);

    try {
      const results = await generateQuizResults(answers);
      const formattedManType = `A ${answers.food} but ${answers.drink} ${results.manType}`;

      storeResults({
        answers,
        manType: results.manType,
        manImage: results.manImage,
        manDescription: "",
        adjective1: answers.food,
        adjective2: answers.drink,
        maxChar: results.maxChar,
        userName: answers.name || "",
      });

      setManType(formattedManType);
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating results:", error);
      setIsLoading(false);
    }
  };

  return <QuizUI generateResults={generateResults} />;
};

export default MyTypeOfMan;
