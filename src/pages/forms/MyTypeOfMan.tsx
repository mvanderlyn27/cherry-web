import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Quiz, QuizResult, LoadingResults } from "../../components/quiz";
import { Question, QuizAnswers } from "../../components/quiz/types";
import posthog from "posthog-js";

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
    // Track quiz page view
    posthog.capture("quiz_page_view");

    const savedAnswers = localStorage.getItem("cherryQuizAnswers");
    const savedResult = localStorage.getItem("cherryQuizResult");
    const savedManType = localStorage.getItem("cherryManType");
    const savedManImage = localStorage.getItem("cherryManImage");
    const savedManDescription = localStorage.getItem("cherryManDescription");
    const savedAdjective1 = localStorage.getItem("cherryAdjective1");
    const savedAdjective2 = localStorage.getItem("cherryAdjective2");
    const savedMaxChar = localStorage.getItem("cherryMaxChar");

    if (
      savedAnswers &&
      savedResult &&
      savedManType &&
      savedManImage &&
      savedManDescription &&
      savedAdjective1 &&
      savedAdjective2 &&
      savedMaxChar
    ) {
      try {
        const parsedAnswers = JSON.parse(savedAnswers);
        setQuizAnswers(parsedAnswers);
        setQuizResult(savedResult);
        setManType("A " + savedAdjective1 + " but " + savedAdjective2 + " " + savedManType);
        setManImage(savedManImage);
        setManDescription(savedManDescription);
        setShowResult(true);
      } catch (error) {
        console.error("Error loading saved quiz data:", error);
        handleRestart(); // Clear everything if there's an error
      }
    }
  }, []);

  // Quiz questions
  const questions: Question[] = [
    {
      id: "name",
      type: "textInput",
      question: "What's your name?",
    },
    {
      id: "ageRange",
      type: "multipleChoice",
      question: "What is your age range?",
      options: [
        { label: "Under 20", value: "under_20" },
        { label: "21 to 30", value: "20_30" },
        { label: "31 to 40", value: "30_40" },
        { label: "41 to 50", value: "40_50" },
        { label: "51+", value: "50+" },
      ],
    },
    {
      id: "style",
      type: "imageChoice",
      question: "Which aesthetic attracts you the most?",
      options: [
        { label: "Flower", value: "abcd", image: "/quiz/aesthetic/flower.jpg" },
        { label: "Tie", value: "efgh", image: "/quiz/aesthetic/tie.jpg" },
        { label: "Glass", value: "ijk", image: "/quiz/aesthetic/glass.jpg" },
        { label: "Chain", value: "lmn", image: "/quiz/aesthetic/chain.jpg" },
      ],
    },
    {
      id: "trope",
      type: "multiSelect",
      question: "What romance tropes do you secretly love? Select all that apply.",
      options: [
        { label: "Enemies to lovers", value: "aeghjlm" },
        { label: "Friends to lovers", value: "bcgkl" },
        { label: "Soulmates", value: "bdgjkn" },
        { label: "Forbidden Love", value: "dfhijkmn" },
        { label: "Fake/Arranged Relationship", value: "acefikmn" },
      ],
    },
    {
      id: "animal",
      type: "imageChoice",
      question: "If your love interest was an animal, which image fits him the most?",
      options: [
        { label: "Lion", value: "aejlm", image: "/quiz/animal/lion.jpg" },
        { label: "Cat", value: "bg", image: "/quiz/animal/cat.jpg" },
        { label: "Horse", value: "dfk", image: "/quiz/animal/horse.jpg" },
        { label: "Eagle", value: "chin", image: "/quiz/animal/eagle.jpg" },
      ],
    },
    {
      id: "vibe",
      type: "imageChoice",
      allowMultiple: true,
      question: "Which images below speak to you the most? Select all that apply.",
      options: [
        { label: "Roses", value: "bdegijkn", image: "/quiz/vibe/roses.jpg" },
        { label: "Knife", value: "afhjmn", image: "/quiz/vibe/knife.jpg" },
        { label: "Cats", value: "abceghil", image: "/quiz/vibe/cats.jpg" },
        { label: "Diamonds", value: "eijm", image: "/quiz/vibe/diamonds.jpg" },
        { label: "Mist", value: "acdefhjln", image: "/quiz/vibe/mist.jpg" },
      ],
    },
    {
      id: "food",
      type: "imageChoice",
      question: "If you were to share a kind of food with your love interest, which would you choose?",
      options: [
        { label: "Milk Chocolate", value: "Sweet", image: "/quiz/food/milkChocolate.png" },
        { label: "Bbq Wings", value: "Spicy", image: "/quiz/food/bbqWings.png" },
        { label: "Pizza", value: "Crazy", image: "/quiz/food/pizza.png" },
        { label: "Marshmallow", value: "Soft", image: "/quiz/food/marshmallow.png" },
        { label: "Bread", value: "Silly", image: "/quiz/food/bread.png" },
        { label: "Boiled Egg", value: "Grumpy", image: "/quiz/food/boiledEgg.png" },
      ],
    },
    {
      id: "drink",
      type: "imageChoice",
      question: "If you were to share a drink with your love interest, which would you choose?",
      options: [
        { label: "Warm Water", value: "Stoic", image: "/quiz/drink/water.png" },
        { label: "Soda", value: "Rebellios", image: "/quiz/drink/soda.png" },
        { label: "Whiskey", value: "Broken", image: "/quiz/drink/whiskey.png" },
        { label: "Beer", value: "Cocky", image: "/quiz/drink/beer.png" },
        { label: "Coffee", value: "Obsessive", image: "/quiz/drink/coffee.png" },
        { label: "Cocktail", value: "Dramatic", image: "/quiz/drink/cocktail.png" },
        { label: "Champagne", value: "Flirty", image: "/quiz/drink/champagne.png" },
        { label: "Green Tea", value: "Loayl", image: "/quiz/drink/greenTea.png" },
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

  const generateResults = async (answers: QuizAnswers) => {
    setIsLoading(true);
    setShowResult(true);

    // Add more detailed logging
    console.log("Starting generateResults with answers:", answers);
    console.log("Quiz answers type:", typeof answers);
    console.log("Quiz answers keys:", Object.keys(answers));

    // Track quiz completion attempt
    posthog.capture("quiz_completion_attempt");

    try {
      // Initialize results object with all possible characters
      const results = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0, n: 0 };
      const archetypes = {
        a: "Bully",
        b: "Childhood Sweetheard",
        c: "Brother's Popular Friend",
        d: "Artist",
        e: "Billionaire",
        f: "Commander",
        g: "Intellectual",
        h: "Assassin",
        i: "Star",
        j: "Vampire Prince",
        k: "Knight",
        l: "Biker",
        m: "Mafia Boss",
        n: "Alpha Wolf",
      };
      const valuesIds = ["style", "trope", "animal", "vibe"];

      console.log("quiz answers", quizAnswers);
      // Loop through each question ID
      for (const id of valuesIds) {
        const answer = answers[id];
        console.log(`Processing ${id}:`, answer); // Debug log

        if (answer) {
          // If it's a multi-select answer, it will be comma-separated
          const values = answer.split(",");

          // Process each selected value
          for (const value of values) {
            // Add a point for each character in the value
            for (const char of value) {
              if (char in results) {
                results[char as keyof typeof results]++;
                console.log(`Added point for ${char} from ${id}`); // Debug log
              }
            }
          }
        }
      }
      // Find the character with the highest score
      const maxChar = Object.entries(results).reduce(
        (max, [char, count]) => (count > results[max as keyof typeof results] ? char : max),
        "a"
      );
      console.log("Character with highest score:", maxChar, "Score:", results[maxChar as keyof typeof results]);
      console.log("Corresponding archetype:", archetypes[maxChar as keyof typeof archetypes]);
      const userName = answers["name"];
      const selectedManType = archetypes[maxChar as keyof typeof archetypes];
      const adjective1 = answers["food"];
      const adjective2 = answers["drink"];
      //need to put answers into buckets here

      setManType("A " + adjective1 + " but " + adjective2 + " " + selectedManType);
      const selectedManImage = "/quiz/results/" + maxChar.toUpperCase() + ".jpg";
      console.log("selectedManImage", selectedManImage);
      setManImage(selectedManImage);
      const selectedManDescription = "He's Cool, this should be generated later";
      setManDescription(selectedManDescription);

      // Generate story with Gemini API
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY as string);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

      const prompt = `
        Create an exciting hook for a romantic story (3-4 paragraphs) about ${
          userName || "a woman"
        } meeting her perfect match. 
        Use these quiz results to craft a compelling narrative:

        Core Character Type: ${selectedManType}
        Personality Traits: ${adjective1} and ${adjective2}
        Preferred Aesthetic: ${quizAnswers.style}
        Favorite Romance Tropes: ${quizAnswers.trope}
        Spirit Animal: ${quizAnswers.animal}
        Resonating Imagery: ${quizAnswers.vibe}
        
        Additional Context:
        - Age Range: ${quizAnswers.ageRange}
        - Drink of Choice: ${quizAnswers.drink}
        - Food Preference: ${quizAnswers.food}

        Writing Guidelines:
        - Start with a strong, attention-grabbing first sentence
        - Build immediate romantic tension
        - Incorporate the selected tropes and imagery naturally
        - Use vivid, sensory descriptions
        - Create a clear personality for both characters based on the quiz choices
        - End with a hook that makes the reader want more
        - Give the love interest a name that matches their archetype
        - Make it feel like the opening of an addictive romance novel
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      console.log("story", text);
      // Save all results to localStorage with consistent naming
      localStorage.setItem("cherryQuizAnswers", JSON.stringify(answers));
      localStorage.setItem("cherryQuizResult", text);
      localStorage.setItem("cherryManType", selectedManType);
      localStorage.setItem("cherryManImage", selectedManImage);
      localStorage.setItem("cherryManDescription", selectedManDescription);
      localStorage.setItem("cherryAdjective1", adjective1);
      localStorage.setItem("cherryAdjective2", adjective2);
      localStorage.setItem("cherryMaxChar", maxChar);

      // Update all state values
      setQuizAnswers(answers);
      setQuizResult(text);
      setManType("A " + adjective1 + " but " + adjective2 + " " + selectedManType);
      setManImage(selectedManImage);
      setManDescription(selectedManDescription);

      // Clear loading state after everything is done
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating story:", error);
      // Track quiz error
      posthog.capture("quiz_error", {
        error: error instanceof Error ? error.message : "Unknown error",
        step: "generation",
      });
      setQuizResult("An error occurred while generating your story. Please try again.");
      // Also clear loading state on error
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    // Track quiz restart
    posthog.capture("quiz_restart");

    // Clear all saved data
    localStorage.removeItem("cherryQuizAnswers");
    localStorage.removeItem("cherryQuizResult");
    localStorage.removeItem("cherryManType");
    localStorage.removeItem("cherryManImage");
    localStorage.removeItem("cherryManDescription");
    localStorage.removeItem("cherryAdjective1");
    localStorage.removeItem("cherryAdjective2");
    localStorage.removeItem("cherryMaxChar");

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
          {!showResult ? (
            <>
              <h1 className="text-3xl md:text-4xl text-pink-200 font-[Pinyon_Script] text-center mb-2">
                Discover Your Type
              </h1>
              <p className="text-white font-[Comme] text-center mb-8">
                Find out what kind of man is your perfect match
              </p>

              <Quiz
                questions={questions}
                onFinished={generateResults}
                initialStep={currentStep}
                initialAnswers={quizAnswers}
              />
            </>
          ) : isLoading ? (
            <>
              <h1 className="text-3xl md:text-4xl text-pink-200 font-[Pinyon_Script] text-center mb-2">
                Discover Your Type
              </h1>
              <p className="text-white font-[Comme] text-center mb-8">
                Find out what kind of man is your perfect match
              </p>
              <LoadingResults />
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl text-pink-200 font-[Pinyon_Script] text-center mb-4">
                Your perfect Match is:
              </h1>
              <QuizResult
                result={quizResult}
                resultTitle={manType}
                resultImage={manImage}
                resultDescription={manDescription}
                onRestart={handleRestart}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTypeOfMan;
