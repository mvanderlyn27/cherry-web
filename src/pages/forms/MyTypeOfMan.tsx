import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Quiz, QuizResult, LoadingResults } from "../../components/quiz";
import { Question, QuizAnswers } from "../../components/quiz/types";

// Main form component
export const MyTypeOfMan = () => {
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({});
  const [quizResult, setQuizResult] = useState<string>("");
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [manType, setManType] = useState<string>("");
  const [manImage, setManImage] = useState<string>("");
  const [manDescription, setManDescription] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Load saved answers from localStorage on component mount
  useEffect(() => {
    const savedAnswers = localStorage.getItem("cherryQuizAnswers");
    const savedResult = localStorage.getItem("cherryQuizResult");
    const savedManType = localStorage.getItem("cherryManType");
    const savedManImage = localStorage.getItem("cherryManImage");
    const savedManDescription = localStorage.getItem("cherryManDescription");

    if (savedAnswers) {
      try {
        const parsedAnswers = JSON.parse(savedAnswers);
        setQuizAnswers(parsedAnswers);

        // If we have saved results, show them
        if (savedResult && savedManType && savedManImage && savedManDescription) {
          setQuizResult(savedResult);
          setManType(savedManType);
          setManImage(savedManImage);
          setManDescription(savedManDescription);
          setShowResult(true);
        }
      } catch (error) {
        console.error("Error parsing saved quiz answers:", error);
        // Clear invalid data
        localStorage.removeItem("cherryQuizAnswers");
      }
    }
  }, []);

  // Quiz questions
  const questions: Question[] = [
    {
      id: "personality",
      type: "multipleChoice",
      question: "What personality traits do you find most attractive?",
      options: [
        { label: "Confident and assertive", value: "confident" },
        { label: "Kind and compassionate", value: "kind" },
        { label: "Mysterious and brooding", value: "mysterious" },
        { label: "Funny and lighthearted", value: "funny" },
      ],
    },
    {
      id: "physique",
      type: "multipleChoice",
      question: "What physical attributes catch your eye?",
      options: [
        { label: "Tall and athletic", value: "athletic" },
        { label: "Rugged and strong", value: "rugged" },
        { label: "Lean and elegant", value: "lean" },
        { label: "Cuddly and comfortable", value: "cuddly" },
      ],
    },
    {
      id: "style",
      type: "imageChoice",
      question: "Which style do you prefer?",
      options: [
        { label: "Classic", value: "classic", image: "/quiz/style-classic.jpg" },
        { label: "Casual", value: "casual", image: "/quiz/style-casual.jpg" },
        { label: "Edgy", value: "edgy", image: "/quiz/style-edgy.jpg" },
        { label: "Professional", value: "professional", image: "/quiz/style-professional.jpg" },
        { label: "Artistic", value: "artistic", image: "/quiz/style-artistic.jpg" },
        { label: "Athletic", value: "athletic", image: "/quiz/style-athletic.jpg" },
      ],
    },
    {
      id: "scenario",
      type: "multipleChoice",
      question: "What scenario would you most enjoy with your ideal partner?",
      options: [
        { label: "A quiet evening at home", value: "quiet" },
        { label: "An adventurous outdoor activity", value: "adventure" },
        { label: "A sophisticated dinner date", value: "dinner" },
        { label: "Dancing the night away", value: "dancing" },
      ],
    },
    {
      id: "archetype",
      type: "imageChoice",
      question: "Which of these men appeals to you most?",
      options: [
        { label: "The CEO", value: "ceo", image: "/quiz/man-ceo.jpg" },
        { label: "The Artist", value: "artist", image: "/quiz/man-artist.jpg" },
        { label: "The Athlete", value: "athlete", image: "/quiz/man-athlete.jpg" },
        { label: "The Bad Boy", value: "badboy", image: "/quiz/man-badboy.jpg" },
        { label: "The Intellectual", value: "intellectual", image: "/quiz/man-intellectual.jpg" },
        { label: "The Outdoorsman", value: "outdoorsman", image: "/quiz/man-outdoorsman.jpg" },
      ],
    },
  ];

  // Map archetype values to display names and descriptions
  interface ManType {
    title: string;
    image: string;
    description: string;
  }

  const manTypes: Record<string, ManType> = {
    ceo: {
      title: "The Executive",
      image: "/quiz/man-ceo.jpg",
      description:
        "Confident, ambitious, and commanding. He knows what he wants and how to get it. He's a natural leader who values success and isn't afraid to take charge.",
    },
    artist: {
      title: "The Creative Soul",
      image: "/quiz/man-artist.jpg",
      description:
        "Sensitive, expressive, and passionate. He sees the world differently and finds beauty in the unexpected. He's emotionally available and values authentic connection.",
    },
    athlete: {
      title: "The Competitor",
      image: "/quiz/man-athlete.jpg",
      description:
        "Disciplined, energetic, and goal-oriented. He's driven by challenges and constantly pushes himself to improve. He brings that same dedication to his relationships.",
    },
    badboy: {
      title: "The Rebel",
      image: "/quiz/man-badboy.jpg",
      description:
        "Mysterious, independent, and unpredictable. He lives by his own rules and isn't concerned with social expectations. He offers excitement and intensity in a relationship.",
    },
    intellectual: {
      title: "The Thinker",
      image: "/quiz/man-intellectual.jpg",
      description:
        "Thoughtful, curious, and articulate. He values knowledge and deep conversations. He approaches relationships with careful consideration and emotional intelligence.",
    },
    outdoorsman: {
      title: "The Adventurer",
      image: "/quiz/man-outdoorsman.jpg",
      description:
        "Rugged, practical, and free-spirited. He's most at home in nature and values experiences over possessions. He brings spontaneity and a sense of wonder to relationships.",
    },
  };

  const generateResults = async () => {
    setIsLoading(true);
    setShowResult(true);

    try {
      // Determine man type based on archetype answer
      const selectedArchetype = quizAnswers.archetype || "intellectual"; // Default fallback
      const selectedManType = manTypes[selectedArchetype as keyof typeof manTypes];

      setManType(selectedManType.title);
      setManImage(selectedManType.image);
      setManDescription(selectedManType.description);

      // Generate story with Gemini API
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY as string);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

      const prompt = `
        Create a short romantic story snippet (about 3-4 paragraphs) about a woman meeting her ideal man. 
        Use these details about her preferences:
        - Personality: ${quizAnswers.personality || "mysterious"}
        - Physical attributes: ${quizAnswers.physique || "athletic"}
        - Style: ${quizAnswers.style || "classic"}
        - Ideal scenario: ${quizAnswers.scenario || "quiet"}
        - Type: ${selectedManType.title}
        
        Make the story sensual and engaging, with vivid descriptions. Start with an initial meeting and end with romantic tension.
        Don't use placeholder names - give the characters actual names. Make the story feel like the beginning of a romance novel.
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      console.log("story", text);
      setQuizResult(text);

      // Save results to localStorage
      localStorage.setItem("cherryQuizAnswers", JSON.stringify(quizAnswers));
      localStorage.setItem("cherryQuizResult", text);
      localStorage.setItem("cherryManType", selectedManType.title);
      localStorage.setItem("cherryManImage", selectedManType.image);
      localStorage.setItem("cherryManDescription", selectedManType.description);
    } catch (error) {
      console.error("Error generating story:", error);
      setQuizResult("An error occurred while generating your story. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    // Clear all saved data
    localStorage.removeItem("cherryQuizAnswers");
    localStorage.removeItem("cherryQuizResult");
    localStorage.removeItem("cherryManType");
    localStorage.removeItem("cherryManImage");
    localStorage.removeItem("cherryManDescription");

    // Reset all state
    setQuizAnswers({});
    setQuizResult("");
    setShowResult(false);
    setIsLoading(false);
    setManType("");
    setManImage("");
    setManDescription("");
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen w-screen bg-[url('/BG.png')] bg-cover bg-center bg-no-repeat bg-fixed">
      <div className="w-full py-8 px-4 min-h-screen flex items-center justify-center">
        <div className="max-w-3xl w-full bg-black/30 backdrop-blur-md p-6 md:p-10 rounded-2xl">
          <h1 className="text-3xl md:text-4xl text-pink-200 font-[Pinyon_Script] text-center mb-2">
            Discover Your Type
          </h1>
          <p className="text-white font-[Comme] text-center mb-8">Find out what kind of man is your perfect match</p>

          {!showResult ? (
            <Quiz
              questions={questions}
              onFinished={generateResults}
              initialStep={currentStep}
              initialAnswers={quizAnswers}
            />
          ) : isLoading ? (
            <LoadingResults />
          ) : (
            <QuizResult
              result={quizResult}
              resultTitle={manType}
              resultImage={manImage}
              resultDescription={manDescription}
              onRestart={handleRestart}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTypeOfMan;
