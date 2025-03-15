import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { QuizAnswers } from "../types";
import { quizQuestions, archetypes, extraInfo } from "./questions";

export const generateQuizResults = async (answers: QuizAnswers) => {
  // Initialize results object with all possible characters
  console.log("answers", answers);
  const results = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0, n: 0 };
  const valuesIds = ["style", "trope", "animal", "vibe"];

  // Process answers and calculate scores
  for (const id of valuesIds) {
    const answer = answers[id];
    if (answer) {
      const values = answer.split(",");
      for (const value of values) {
        for (const char of value) {
          if (char in results) {
            results[char as keyof typeof results]++;
          }
        }
      }
    }
  }

  // Find the character with the highest score
  const maxCharValue = Object.entries(results).reduce(
    (max, [char, count]) => (count > results[max as keyof typeof results] ? char : max),
    "a"
  );

  // Get result details
  const selectedManType = archetypes[maxCharValue as keyof typeof archetypes];
  const extraDetails = extraInfo[maxCharValue as keyof typeof archetypes];
  const trope = quizQuestions
    .find((val) => val.id === "trope")
    ?.options?.find((val) => val.value === answers.trope)?.label;
  const selectedManImage = `/quiz/results/${maxCharValue.toUpperCase()}.jpg`;

  // Generate description using Gemini API
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-lite",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        description: "",
        properties: {
          man_description: {
            type: SchemaType.STRING,
            description: "50 words max, characteristics for this type of man, based on all context you have",
          },
        },
        required: ["man_description"],
      },
    },
  });

  const prompt = `
    Create a structured response with one field:
    - man_description:
      - Write a short summary of a romantic dynamic between ${answers.name} and A ${
    answers.food + " but " + answers.drink + " " + selectedManType
  } 
      - Integrate some of the following elements, as long as they make sense to the story (prioritizing conflict/drama): [${trope}, ${extraDetails}, can include locations, relationships, tropes, secrets, etc.] Add new elements to amplify drama and connection if needed. Ensure the ${
    answers.food
  }, and ${
    answers.drink
  } aspects of the ${selectedManType} is evident even if in conflict with the adjective, also don't explicitely repeat the adjective, use show don't tell.
      - The description should be 40-50 words maximum.
      - Focus on a central *conflict* and a strong initial *attraction/temptation*, even if dangerous. Show *vulnerability* on at least one side (or both).
      - Avoid repeating words from this prompt.
      - Start with: "The ${selectedManType}..." and continue the story from your point of view.
      - Use third-person references for the ${selectedManType} ("he", "him"), avoid coming up with a name for him.
      - The summary should imply a continuing story, not a resolved one.

    Format your response as a JSON object with this field.  `;
  console.log("prompt", prompt);
  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  const parsedResponse = JSON.parse(responseText);

  return {
    manType: selectedManType,
    manImage: selectedManImage,
    manDescription: parsedResponse.man_description,
    maxChar: maxCharValue,
  };
};
