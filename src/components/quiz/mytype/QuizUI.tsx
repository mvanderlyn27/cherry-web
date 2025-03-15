import { Quiz } from "../shared/Quiz";
import { quizQuestions } from "./questions";
import { useQuizStore } from "../../../lib/store/quizStore";
import { LoadingResults, QuizAnswers, QuizResult } from "../shared";

export const QuizUI = ({ generateResults }: { generateResults: (answer: QuizAnswers) => void }) => {
  const {
    quizAnswers,
    showResult,
    isLoading,
    manType,
    manImage,
    manDescription,
    userName,
    currentStep,
    setCurrentStep,
    resetQuiz,
  } = useQuizStore();

  const handleRestart = () => {
    resetQuiz();
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen w-full bg-[url('/BG.png')] bg-cover bg-center bg-no-repeat bg-fixed">
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="max-w-3xl w-full bg-black/30 backdrop-blur-md p-6 md:p-10 rounded-2xl">
          {!showResult ? (
            <>
              <h1 className="text-3xl md:text-4xl text-pink-200 font-[Pinyon_Script] text-center mb-2">
                Discover Your Type
              </h1>
              <p className="text-white font-[Comme] text-center mb-8">
                Find out what kind of man is your perfect match
              </p>
              <Quiz
                questions={quizQuestions}
                onFinished={generateResults}
                initialStep={currentStep}
                initialAnswers={quizAnswers}
              />
            </>
          ) : isLoading ? (
            <>
              <h1 className="text-3xl md:text-4xl text-pink-200 font-[Pinyon_Script] text-center mb-2">
                Loading {userName ? userName + "s " : "Your"} Soulmate
              </h1>
              <LoadingResults />
            </>
          ) : (
            <QuizResult
              resultTitle={manType}
              resultImage={manImage}
              resultDescription={manDescription}
              onRestart={handleRestart}
              userName={userName}
            />
          )}
        </div>
      </div>
    </div>
  );
};
