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
  // const extraDetails = extraInfo[maxCharValue as keyof typeof archetypes];
  // const trope = quizQuestions
  // .find((val) => val.id === "trope")
  // ?.options?.find((val) => val.value === answers.trope)?.label;
  const selectedManImage = `/quiz/results/${maxCharValue.toUpperCase()}.jpg`;

  // // Generate description using Gemini API
  // const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY as string);
  // const model = genAI.getGenerativeModel({
  //   model: "gemini-2.0-flash-lite",
  //   generationConfig: {
  //     responseMimeType: "application/json",
  //     responseSchema: {
  //       type: SchemaType.OBJECT,
  //       description: "",
  //       properties: {
  //         date_description: {
  //           type: SchemaType.STRING,
  //           description: "40 words max, dream date description",
  //         },
  //       },
  //       required: ["date_description"],
  //     },
  //   },
  // });

  // const prompt = `
  //   Create a structured response with one field:
  //   - date_description:
  //     - 20 words max, description of a dream date between the user: ${answers.name} and their soulmate: "A${answers.food} but, ${answers.drink} ${selectedManType}".
  //     - come up with a dream date that women 20-40 would love, ensure it makes sense based on the type of soulmate .
  //   Format your response as a JSON object with this field.`;
  // console.log("prompt", prompt);
  // const result = await model.generateContent(prompt);
  // const responseText = result.response.text();
  // const parsedResponse = JSON.parse(responseText);

  return {
    manType: selectedManType,
    manImage: selectedManImage,
    // dateDescription: parsedResponse.date_description,
    maxChar: maxCharValue,
  };
};
