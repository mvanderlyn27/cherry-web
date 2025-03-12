import { useState, useEffect, FormEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Type definitions
interface FormWizardProps {
  currentStep: number;
  totalSteps: number;
}

interface Option {
  label: string;
  value: string;
  image?: string;
}

interface MultipleChoiceProps {
  question: string;
  options: Option[];
  onSelect: (value: string) => void;
  selectedValue?: string;
}

interface ImageChoiceProps {
  question: string;
  options: Option[];
  onSelect: (value: string) => void;
  selectedValue?: string;
}

interface QuizResultProps {
  result: string;
  manType: string;
  manImage: string;
  manDescription: string;
  onJoinWaitlist: () => void;
}

interface QuizAnswers {
  [key: string]: string;
}

// Form steps and wizard components
const FormWizard = ({ currentStep, totalSteps }: FormWizardProps) => {
  // Calculate completion percentage based on completed steps (current step - 1)
  // This makes the first question show 0% until answered
  const completedSteps = currentStep - 1;
  const percentComplete = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white font-[Comme] text-sm">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-white font-[Comme] text-sm">{percentComplete}% Complete</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-2.5">
        <div
          className="bg-[#B87CED] h-2.5 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${percentComplete}%` }}></div>
      </div>
    </div>
  );
};

// Question types
const MultipleChoice = ({ question, options, onSelect, selectedValue }: MultipleChoiceProps) => {
  return (
    <div className="w-full animate-fadeIn">
      <h3 className="text-xl md:text-2xl text-white font-[Kaisei_Decol] mb-6 text-center">{question}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(option.value)}
            className={`${
              selectedValue === option.value ? "bg-white/30" : "bg-white/10"
            } backdrop-blur-sm text-white p-4 rounded-lg hover:bg-white/20 transition-all duration-300 text-left font-[Comme] animate-scaleIn`}
            style={{ animationDelay: `${index * 100}ms` }}>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const ImageChoice = ({ question, options, onSelect, selectedValue }: ImageChoiceProps) => {
  return (
    <div className="w-full animate-fadeIn">
      <h3 className="text-xl md:text-2xl text-white font-[Kaisei_Decol] mb-6 text-center">{question}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => onSelect(option.value)}
            className={`cursor-pointer relative group animate-scaleIn ${
              selectedValue === option.value ? "ring-2 ring-pink-300" : ""
            }`}
            style={{ animationDelay: `${index * 100}ms` }}>
            <img
              src={option.image}
              alt={option.label}
              className="w-full aspect-square object-cover rounded-lg transition-all duration-300 group-hover:opacity-90 group-hover:scale-105"
            />
            <div
              className={`absolute inset-0 flex items-center justify-center ${
                selectedValue === option.value ? "bg-black/60" : "bg-black/40 opacity-0 group-hover:opacity-100"
              } transition-opacity duration-300 rounded-lg`}>
              <span className="text-white font-[Comme]">{option.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Loading component
const LoadingResults = () => {
  return (
    <div className="w-full animate-fadeIn flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 border-4 border-t-[#B87CED] border-white/30 rounded-full animate-spin mb-4"></div>
      <p className="text-white font-[Comme]">Fetching your results...</p>
    </div>
  );
};

// Result component
const QuizResult = ({ result, manType, manImage, manDescription, onJoinWaitlist }: QuizResultProps) => {
  const [visibleText, setVisibleText] = useState<string>("");

  useEffect(() => {
    if (result) {
      // Show first two paragraphs to demonstrate blur effect
      const paragraphs = result.split("\n\n");
      const visibleParagraphs = paragraphs.slice(0, 2).join("\n\n");
      setVisibleText(visibleParagraphs);
    }
  }, [result]);

  return (
    <div className="w-full animate-fadeIn">
      <h2 className="text-2xl md:text-3xl text-white font-[Kaisei_Decol] mb-6 text-center">Your Perfect Match</h2>

      <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="md:w-1/3">
            <img src={manImage} alt={manType} className="w-full aspect-square object-cover rounded-lg" />
          </div>
          <div className="md:w-2/3">
            <h3 className="text-xl text-pink-200 font-[Kaisei_Decol] mb-3">{manType}</h3>
            <p className="text-white font-[Comme]">{manDescription}</p>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6">
          <h3 className="text-xl text-pink-200 font-[Kaisei_Decol] mb-3">Your Love Story</h3>
          <div className="relative">
            <p className="text-white font-[Comme] mb-4">{visibleText}</p>
            <div className="h-48 bg-gradient-to-b from-transparent to-black/90 absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-6">
              <button
                onClick={onJoinWaitlist}
                className="font-[Comme] text-sm cursor-pointer bg-white text-[#B87CED] px-8 py-3 rounded-full transition-all duration-700 animate-[pulse-glow_2s_ease-in-out_infinite] hover:pause-animation hover:shadow-[0_0_20px_3px_rgba(168,85,247,0.7)] hover:scale-105">
                Read More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Question {
  id: string;
  type: "multipleChoice" | "imageChoice";
  question: string;
  options: Option[];
}

// Main form component
export const MyTypeOfMan = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({});
  const [quizResult, setQuizResult] = useState<string>("");
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [manType, setManType] = useState<string>("");
  const [manImage, setManImage] = useState<string>("");
  const [manDescription, setManDescription] = useState<string>("");

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
      generateResults();
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
        generateResults();
      }
    }
  };

  // Map archetype values to display names and descriptions
  const manTypes = {
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
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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
      setQuizResult(text);
    } catch (error) {
      console.error("Error generating story:", error);

      // Fallback to sample story if API fails
      const sampleStory = `You first met at a local coffee shop. He was sitting in the corner, focused on his work, but something about him caught your eye immediately. After exchanging glances a few times, he finally approached you with a confident smile.

Your first date was magical - conversation flowed effortlessly as you discovered shared interests and complementary differences. His ${
        quizAnswers.personality || "mysterious"
      } personality perfectly balanced your own, creating a dynamic that felt both exciting and comfortable.

As weeks turned into months, you found yourself falling deeper. The way he carried himself with that ${
        quizAnswers.physique || "athletic"
      } build, always dressed in his signature ${
        quizAnswers.style || "classic"
      } style, made your heart skip every time he walked into a room.

Your favorite moments together are when you're ${
        quizAnswers.scenario || "having a quiet evening at home"
      }, where you can truly be yourselves and connect on a deeper level.`;

      setQuizResult(sampleStory);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinWaitlist = () => {
    // Redirect to main page waitlist form
    window.location.href = "/#waitlist";
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
            <>
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
            </>
          ) : isLoading ? (
            <LoadingResults />
          ) : (
            <QuizResult
              result={quizResult}
              manType={manType}
              manImage={manImage}
              manDescription={manDescription}
              onJoinWaitlist={handleJoinWaitlist}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTypeOfMan;
