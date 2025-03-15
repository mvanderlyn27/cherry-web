import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { QuizAnswers } from "../types";
import { quizQuestions, archetypes } from "./questions";

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
    1. man_description: A detailed description of the male book boyfriend based on the quiz results

    Use these quiz results to craft your response:
    Core Character Type: ${selectedManType}
    Personality Traits: ${answers.food} and ${answers.drink}
    Preferred Aesthetic: ${
      quizQuestions.find((val) => val.id === "style")?.options?.find((val) => val.value === answers.style)?.label || ""
    }
    Favorite Romance Tropes: ${
      quizQuestions.find((val) => val.id === "trope")?.options?.find((val) => val.value === answers.trope)?.label ||
      "enemies to lovers"
    }
    Spirit Animal: ${
      quizQuestions.find((val) => val.id === "animal")?.options?.find((val) => val.value === answers.animal)?.label ||
      "cat"
    }
    Resonating Imagery: ${answers.vibe
      .split(",")
      .map(
        (cur_vibe: string) =>
          quizQuestions.find((val) => val.id === "vibe")?.options?.find((val) => val.value === cur_vibe)?.label ||
          "diamonds"
      )}
    Additional Context:
    - Name: ${answers.name || "the protagonist"}
    - Age Range: ${answers.ageRange || "adult"}
    - Drink of Choice: ${answers.drink}
    - Food Preference: ${answers.food}

    For the man_description:
    - This should max 50 words
    - This is a quick summary of how the user, and this book boyfriend meet/fall in love
    - avoid including names for the man

    Format your response as a JSON object with this field.
  `;

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
