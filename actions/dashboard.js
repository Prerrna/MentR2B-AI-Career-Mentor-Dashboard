// "use server";

// import { db } from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({
//   model: "gemini-2.5-flash",
// });

// export const generateAIInsights = async (industry) => {
//   const prompt = `
//           Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
//           {
//             "salaryRanges": [
//               { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
//             ],
//             "growthRate": number,
//             "demandLevel": "HIGH" | "MEDIUM" | "LOW",
//             "topSkills": ["skill1", "skill2"],
//             "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEFATIVE",
//             "keyTrends": ["trend1", "trend2"],
//             "recommendedSkills": ["skill1", "skill2"]
//           }
          
//           IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
//           Include at least 5 common roles for salary ranges.
//           Growth rate should be a percentage.
//           Include at least 5 skills and trends.
//         `;

//   const result = await model.generateContent(prompt);
//   const response = result.response;
//   const text = response.text();
//   const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

//   return JSON.parse(cleanedText);
// };
// export async function getIndustryInsights() {
//   const { userId } = await auth();
//   if (!userId) throw new Error("Unauthorized");

//   const user = await db.user.findUnique({
//     where: {
//       clerkUserId: userId,
//     },
//     include:{
//       industryInsight: true,
//     }
//   });
//   if (!user) throw new Error("User not found");

//   // if (!user.industryInsight) {
//   //   const insights = await generateAIInsights(user.industry);

//   //   const industryInsight = await db.industryInsight.create({
//   //     data: {
//   //       industry: user.industry,
//   //       ...insights,
//   //       nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//   //     },
//   //   });
//   //   return industryInsight;
//   // }
//   // return user.industryInsight;
// //   let insights = {};
// // try {
// //   insights = await generateAIInsights(user.industry);
// // } catch (e) {
// //   console.error("AI insights failed:", e.message);
// //   insights = {}; // fallback to empty object
// // }
// if (!user.industryInsight) {
//   // 🔹 Safe AI call
//   let insights = {};
//   try {
//     insights = await generateAIInsights(user.industry);
//   } catch (e) {
//     console.error("AI insights failed:", e.message);
//     insights = {}; // fallback to empty object
//   }

//   const industryInsight = await db.industryInsight.create({
//     data: {
//       industry: user.industry,
//       ...insights,
//       nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//     },
//   });
//   return industryInsight;
// }
// }

"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export const generateAIInsights = async (industry) => {
  const prompt = `
    Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
    {
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
      ],
      "growthRate": number,
      "demandLevel": "HIGH" | "MEDIUM" | "LOW",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
      "keyTrends": ["trend1", "trend2"],
      "recommendedSkills": ["skill1", "skill2"]
    }

    IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
    Include at least 5 common roles for salary ranges.
    Growth rate should be a percentage.
    Include at least 5 skills and trends.
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const parsed = JSON.parse(cleanedText);

    // Ensure salaryRanges is always an array
    if (!Array.isArray(parsed.salaryRanges)) parsed.salaryRanges = [];
    return parsed;
  } catch (e) {
    console.error("AI insights generation failed:", e.message);
    return {
      salaryRanges: [],
      growthRate: 0,
      demandLevel: "MEDIUM",
      topSkills: [],
      marketOutlook: "NEUTRAL",
      keyTrends: [],
      recommendedSkills: [],
    };
  }
};

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });

  if (!user) throw new Error("User not found");

  // If user already has insights, return them
  if (user.industryInsight) return user.industryInsight;

  // Otherwise, generate new AI insights safely
  const insights = await generateAIInsights(user.industry);

  const industryInsight = await db.industryInsight.create({
    data: {
      industry: user.industry,
      ...insights,
      nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return industryInsight;
}