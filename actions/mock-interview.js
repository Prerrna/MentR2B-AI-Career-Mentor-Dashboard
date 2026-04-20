// // "use server";

// // import { db } from "@/lib/prisma";
// // import { auth } from "@clerk/nextjs/server";
// // import { GoogleGenerativeAI } from "@google/generative-ai";

// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// // const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// // /**
// //  * Step 1: Generate mock interview questions
// //  */
// // export async function generateMockInterview(formData) {
// //   const { userId } = await auth();
// //   if (!userId) throw new Error("Unauthorized");

// //   // Use formData if passed, else fallback to last interviewForm
// //   let form;
// //   if (formData) {
// //     form = formData;
// //   } else {
// //     const latestForm = await db.interviewForm.findFirst({
// //       where: { userId },
// //       orderBy: { createdAt: "desc" },
// //     });
// //     if (!latestForm) throw new Error("No interview form found");
// //     form = {
// //       type: latestForm.type,
// //       industry: latestForm.industry || "",
// //       role: latestForm.role || "",
// //       project: latestForm.project,
// //       experience: latestForm.experience,
// //       skills: latestForm.skills || [],
// //       numQuestions: latestForm.numQuestions,
// //     };
// //   }

// //   const prompt = `You are a highly experienced professional interviewer with expertise in conducting real-world interviews.

// // Generate a ${form.type} mock interview with ${form.numQuestions} realistic and challenging questions for a ${form.industry} role: ${form.role}.  
// // The candidate has ${form.experience} years of professional experience, has worked on a project (${form.project}), ${
// //   form.skills.length
// //     ? `and possesses strong skills in ${form.skills.join(", ")}.`
// //     : ""
// // }

// // ---

// // ### 🎯 Objective
// // You must generate realistic, conversational interview questions and corresponding ideal answers based on the provided form data.

// // ---

// // ### 🧩 Rules & Structure

// // #### 1. Interview Type Rules
// // - If ${form.type} = **"behavioral"**:
// //   - Ask **HR-style, real-world** questions testing communication, teamwork, leadership, adaptability, decision-making, and conflict resolution.
// //   - The **first question must always be:** “Tell me about yourself.”

// // - If ${form.type} = **"technical"**:
// //   - Ask **only technical questions** related to ${form.skills}, ${form.role}, and ${form.industry}.
// //   - Then, follow the **Question Composition** rule below.
// //   -The **first question must always be:** “Tell me about yourself.”
// // - If ${form.type} = **"coding"**:
// //   - Ask **only coding questions** (no theory or HR). from ${form.skills}.
// //   - Do **not** include “Tell me about yourself,” behavioral, or project-based questions.

// // ---

// // #### 2. Question Composition
// // - If ${form.project} is provided and not an empty string (""):
// //   - Maintain a **70:30 ratio**:
// //     - 70% skill-based or fundamental questions derived from ${form.skills}, ${form.role}, and ${form.industry}.
// //     - 30% project-based or scenario-driven questions focused on ${form.project}.
// // - Else:
// //   - Ask **only** skill-based or fundamental questions derived from ${form.skills}, ${form.role}, and ${form.industry}.

// // ---

// // #### 3. Question Count Rules
// // - If ${form.numQuestions} > 9:
// //   - Include **1–2 simple short coding or problem-solving questions**.
// //   - These must clearly state: “Please write or explain your approach to…”

// // ---

// // #### 4. Tone & Style
// // - Questions must sound **natural, professional, and conversational** — like an actual interviewer.
// // - Avoid robotic, repetitive, or exam-style phrasing.
// // - Maintain logical flow and engagement throughout the interview.

// // ---

// // #### 5. Answer Quality
// // - For every question, generate an "idealAnswer" that reflects a **strong, concise, and realistic** response from a well-prepared candidate.
// // - Answers should be **clear, relevant, and specific** to the question.

// // ---

// // #### 6. Output Format
// // - Return **only valid JSON**, with no extra commentary, explanations, or markdown.
// // - Follow this exact format:

// // {
// //   "questions": [
// //     {
// //       "question": "string",
// //       "idealAnswer": "string"
// //     }
// //   ]
// // }
// // `;

// //   try {
// //     const result = await model.generateContent(prompt);
// //     const text = result.response.text();
// //     const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
// //     const mock = JSON.parse(cleanedText);

// //     return mock.questions;
// //   } catch (error) {
// //     console.error("Error generating mock interview:", error);
// //     throw new Error("Failed to generate mock interview questions");
// //   }
// // }

// // export async function saveMockInterviewResult(questions, userAnswers) {
// //   const { userId } = await auth();
// //   if (!userId) throw new Error("Unauthorized");

// //   const user = await db.user.findUnique({
// //     where: { clerkUserId: userId },
// //   });
// //   if (!user) throw new Error("User not found");

// //   // Evaluate responses
// //   const evaluated = questions.map((q, idx) => ({
// //     question: q.question,
// //     idealAnswer: q.idealAnswer,
// //     userAnswer: userAnswers[idx] || "",
// //   }));

// //   const feedbackPrompt = `
// //   The candidate answered the following mock interview questions:

// //   ${evaluated
// //     .map(
// //       (q, i) => `
// //       Q${i + 1}: ${q.question}
// //       Ideal Answer: ${q.idealAnswer}
// //       Candidate Answer: ${q.userAnswer}
// //       `
// //     )
// //     .join("\n\n")}

// //   Task:
// //   - Provide short, specific feedback for each answer (1–2 sentences).
// //   - Suggest ONE overall improvement tip (max 5 sentences) based on Communication,Technical Skills,Problem Solving.
// //   - Evaluate if the answer is correct or not with boolean value;
// //   - Give score of 100;
  
// //   Return strictly in JSON format:
// //   {
// //     "feedback": ["string", "string", ...],
// //     "improvementTip": "string"
// //     " isCorrect: boolen"
// //     "interviewscore:number"
// //   }
// //   `;

// //   let feedbackData = { feedback: [], improvementTip: null };
// //   try {
// //     const feedbackResult = await model.generateContent(feedbackPrompt);
// //     const text = feedbackResult.response.text();
// //     const cleaned = text.replace(/```(?:json)?\n?/g, "").trim();
// //     feedbackData = JSON.parse(cleaned);
// //   } catch (error) {
// //     console.error("Error generating feedback:", error);
// //   }

// //   // Attach feedback to answers
// //   const finalResults = evaluated.map((q, i) => ({
// //     ...q,
// //     feedback: feedbackData.feedback?.[i] || null,
// //     isCorrect: feedbackData.isCorrect?.[i] || false,
// //   }));

// //   try {
// //     const assessment = await db.mockInterviewAssessment.create({
// //       data: {
// //         userId: user.id,
// //         questions: finalResults,
// //         category: "Mock Interview",
// //         improvementTip: feedbackData.improvementTip,
// //         interviewscore: feedbackData.interviewscore,
// //       },
// //     });

// //     return assessment;
// //   } catch (error) {
// //     console.error("Error saving mock interview result:", error);
// //     throw new Error("Failed to save mock interview result");
// //   }
// // }

// // /**
// //  * Step 3: Get all mock interview assessments
// //  */
// // export async function getMockInterviews() {
// //   const { userId } = await auth();
// //   if (!userId) throw new Error("Unauthorized");

// //   const user = await db.user.findUnique({
// //     where: { clerkUserId: userId },
// //   });
// //   if (!user) throw new Error("User not found");

// //   try {
// //     return await db.mockInterviewAssessment.findMany({
// //       where: { userId: user.id },
// //       orderBy: { createdAt: "desc" },
// //     });
// //   } catch (error) {
// //     console.error("Error fetching mock interviews:", error);
// //     throw new Error("Failed to fetch mock interview results");
// //   }
// // }
// // // "use server";

// // // import { db } from "@/lib/prisma";
// // // import { auth } from "@clerk/nextjs/server";
// // // import { cookies } from "next/headers";
// // // import { GoogleGenerativeAI } from "@google/generative-ai";

// // // // Initialize the AI model
// // // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// // // const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// // // /**
// // //  * Step 1: Generate mock interview questions
// // //  */
// // // export async function generateMockInterview(formData) {
// // //   const { userId } = await auth({ cookies: cookies() });
// // //   if (!userId) throw new Error("Unauthorized");

// // //   let form = formData;
// // //   if (!form) {
// // //     const latestForm = await db.interviewForm.findFirst({
// // //       where: { userId },
// // //       orderBy: { createdAt: "desc" },
// // //     });
// // //     if (!latestForm) throw new Error("No interview form found");

// // //     form = {
// // //       type: latestForm.type,
// // //       industry: latestForm.industry || "",
// // //       role: latestForm.role || "",
// // //       project: latestForm.project,
// // //       experience: latestForm.experience,
// // //       skills: latestForm.skills || [],
// // //       numQuestions: latestForm.numQuestions,
// // //     };
// // //   }

// // //   const prompt = `You are a professional interviewer...
// // //   ...[your full AI prompt as in previous code]...
// // //   `;

// // //   try {
// // //     const result = await model.generateContent(prompt);
// // //     const text = result.response.text();
// // //     const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
// // //     const mock = JSON.parse(cleanedText);

// // //     return mock.questions;
// // //   } catch (error) {
// // //     console.error("Error generating mock interview:", error);
// // //     throw new Error("Failed to generate mock interview questions");
// // //   }
// // // }

// // // /**
// // //  * Step 2: Save user answers and get feedback
// // //  */
// // // export async function saveMockInterviewResult(questions, userAnswers) {
// // //   const { userId } = await auth({ cookies: cookies() });
// // //   if (!userId) throw new Error("Unauthorized");

// // //   const user = await db.user.findUnique({
// // //     where: { clerkUserId: userId },
// // //   });
// // //   if (!user) throw new Error("User not found");

// // //   // Evaluate user responses
// // //   const evaluated = questions.map((q, idx) => ({
// // //     question: q.question,
// // //     idealAnswer: q.idealAnswer,
// // //     userAnswer: userAnswers[idx] || "",
// // //   }));

// // //   const feedbackPrompt = `
// // //     The candidate answered the following mock interview questions...
// // //     [your full feedback prompt as in previous code]
// // //   `;

// // //   let feedbackData = { feedback: [], improvementTip: null };
// // //   try {
// // //     const feedbackResult = await model.generateContent(feedbackPrompt);
// // //     const text = feedbackResult.response.text();
// // //     const cleaned = text.replace(/```(?:json)?\n?/g, "").trim();
// // //     feedbackData = JSON.parse(cleaned);
// // //   } catch (error) {
// // //     console.error("Error generating feedback:", error);
// // //   }

// // //   const finalResults = evaluated.map((q, i) => ({
// // //     ...q,
// // //     feedback: feedbackData.feedback?.[i] || null,
// // //     isCorrect: feedbackData.isCorrect?.[i] || false,
// // //   }));

// // //   try {
// // //     const assessment = await db.mockInterviewAssessment.create({
// // //       data: {
// // //         userId: user.id,
// // //         questions: finalResults,
// // //         category: "Mock Interview",
// // //         improvementTip: feedbackData.improvementTip,
// // //         interviewscore: feedbackData.interviewscore,
// // //       },
// // //     });

// // //     return assessment;
// // //   } catch (error) {
// // //     console.error("Error saving mock interview result:", error);
// // //     throw new Error("Failed to save mock interview result");
// // //   }
// // // }

// // // /**
// // //  * Step 3: Fetch all mock interview assessments
// // //  */
// // // export async function getMockInterviews() {
// // //   const { userId } = await auth({ cookies: cookies() });
// // //   if (!userId) throw new Error("Unauthorized");

// // //   const user = await db.user.findUnique({
// // //     where: { clerkUserId: userId },
// // //   });
// // //   if (!user) throw new Error("User not found");

// // //   try {
// // //     return await db.mockInterviewAssessment.findMany({
// // //       where: { userId: user.id },
// // //       orderBy: { createdAt: "desc" },
// // //     });
// // //   } catch (error) {
// // //     console.error("Error fetching mock interviews:", error);
// // //     throw new Error("Failed to fetch mock interview results");
// // //   }
// // // }
// // "use server";

// // import { db } from "@/lib/prisma";
// // import { auth } from "@clerk/nextjs/server";
// // import { GoogleGenerativeAI } from "@google/generative-ai";

// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// // const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// // // Helper to safely parse JSON from AI responses
// // function parseAIJSON(text) {
// //   const cleaned = text.replace(/```(?:json)?/g, "").trim();
// //   const match = cleaned.match(/\{[\s\S]*\}/); // extract the first {...} block
// //   if (!match) throw new Error("No JSON found in AI response");
// //   return JSON.parse(match[0]);
// // }

// // export async function generateMockInterview(formData) {
// //   const { userId } = await auth();
// //   if (!userId) throw new Error("Unauthorized");

// //   // Use formData if passed, else fallback to last interviewForm
// //   let form;
// //   if (formData) {
// //     form = formData;
// //   } else {
// //     const latestForm = await db.interviewForm.findFirst({
// //       where: { userId },
// //       orderBy: { createdAt: "desc" },
// //     });
// //     if (!latestForm) throw new Error("No interview form found");
// //     form = {
// //       type: latestForm.type,
// //       industry: latestForm.industry || "",
// //       role: latestForm.role || "",
// //       project: latestForm.project,
// //       experience: latestForm.experience,
// //       skills: latestForm.skills || [],
// //       numQuestions: latestForm.numQuestions,
// //     };
// //   }

// //   const prompt = `
// // You are an experienced professional interviewer. Generate a ${form.type} mock interview with ${form.numQuestions} questions for a candidate in ${form.industry} role: ${form.role}.
// // Candidate has ${form.experience} years of experience, worked on project: ${form.project}, and has skills: ${form.skills.join(", ") || "none"}.

// // --- Rules ---
// // 1. First question must be "Tell me about yourself."
// // 2. Questions must match type: behavioral, technical, or coding.
// // 3. Provide ideal answers for each question.
// // 4. Return ONLY valid JSON, strictly following this format:

// // {
// //   "questions": [
// //     { "question": "string", "idealAnswer": "string" }
// //   ]
// // }

// // Do NOT include any extra text, explanations, or markdown.
// // `;

// //   try {
// //     const result = await model.generateContent(prompt);
// //     const text = result.response.text();
// //     const mock = parseAIJSON(text); // Safe JSON parsing
// //     return mock.questions;
// //   } catch (error) {
// //     console.error("Error generating mock interview:", error);
// //     throw new Error("Failed to generate mock interview questions");
// //   }
// // }
// // "use server";

// // import { db } from "@/lib/prisma";
// // import { auth } from "@clerk/nextjs/server";
// // import { GoogleGenerativeAI } from "@google/generative-ai";

// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// // const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// // export async function generateMockInterview(formData) {
// //   const { userId } = await auth();
// //   if (!userId) throw new Error("Unauthorized");

// //   // Use formData if passed, else fallback to last interviewForm
// //   let form;
// //   if (formData) {
// //     form = formData;
// //   } else {
// //     const latestForm = await db.interviewForm.findFirst({
// //       where: { userId },
// //       orderBy: { createdAt: "desc" },
// //     });
// //     if (!latestForm) throw new Error("No interview form found");
// //     form = {
// //       type: latestForm.type,
// //       industry: latestForm.industry || "",
// //       role: latestForm.role || "",
// //       project: latestForm.project,
// //       experience: latestForm.experience,
// //       skills: latestForm.skills || [],
// //       numQuestions: latestForm.numQuestions,
// //     };
// //   }

// //   // Full detailed prompt with all your rules
// //   const prompt = `
// // You are a highly experienced professional interviewer with expertise in conducting real-world interviews.

// // Generate a ${form.type} mock interview with ${form.numQuestions} realistic and challenging questions for a ${form.industry} role: ${form.role}.  
// // The candidate has ${form.experience} years of professional experience, has worked on a project (${form.project}), ${
// //     form.skills.length
// //       ? `and possesses strong skills in ${form.skills.join(", ")}.`
// //       : ""
// //   }

// // ---

// // ### 🎯 Objective
// // You must generate realistic, conversational interview questions and corresponding ideal answers based on the provided form data.

// // ---

// // ### 🧩 Rules & Structure

// // #### 1. Interview Type Rules
// // - If ${form.type} = **"behavioral"**:
// //   - Ask **HR-style, real-world** questions testing communication, teamwork, leadership, adaptability, decision-making, and conflict resolution.
// //   - The **first question must always be:** “Tell me about yourself.”

// // - If ${form.type} = **"technical"**:
// //   - Ask **only technical questions** related to ${form.skills}, ${form.role}, and ${form.industry}.
// //   - Then, follow the **Question Composition** rule below.
// //   - The **first question must always be:** “Tell me about yourself.”
// // - If ${form.type} = **"coding"**:
// //   - Ask **only coding questions** (no theory or HR). from ${form.skills}.
// //   - Do **not** include “Tell me about yourself,” behavioral, or project-based questions.

// // ---

// // #### 2. Question Composition
// // - If ${form.project} is provided and not empty:
// //   - Maintain a **70:30 ratio**:
// //     - 70% skill-based or fundamental questions derived from ${form.skills}, ${form.role}, and ${form.industry}.
// //     - 30% project-based or scenario-driven questions focused on ${form.project}.
// // - Else:
// //   - Ask **only** skill-based or fundamental questions derived from ${form.skills}, ${form.role}, and ${form.industry}.

// // ---

// // #### 3. Question Count Rules
// // - If ${form.numQuestions} > 9:
// //   - Include **1–2 simple short coding or problem-solving questions**.
// //   - These must clearly state: “Please write or explain your approach to…”

// // ---

// // #### 4. Tone & Style
// // - Questions must sound **natural, professional, and conversational** — like an actual interviewer.
// // - Avoid robotic, repetitive, or exam-style phrasing.
// // - Maintain logical flow and engagement throughout the interview.

// // ---

// // #### 5. Answer Quality
// // - For every question, generate an "idealAnswer" that reflects a **strong, concise, and realistic** response from a well-prepared candidate.
// // - Answers should be **clear, relevant, and specific** to the question.

// // ---

// // #### 6. Output Format
// // - Return **only valid JSON**, with no extra commentary, explanations, or markdown.
// // - Follow this exact format:

// // {
// //   "questions": [
// //     {
// //       "question": "string",
// //       "idealAnswer": "string"
// //     }
// //   ]
// // }
// // `;

// //   try {
// //     const result = await model.generateContent(prompt);
// //     const text = result.response.text();
// //     const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

// //     // Safe JSON parsing
// //     let mock;
// //     try {
// //       mock = JSON.parse(cleanedText);
// //     } catch (e) {
// //       console.error("Failed to parse AI JSON:", cleanedText);
// //       throw new Error("AI response was not valid JSON");
// //     }

// //     return mock.questions;
// //   } catch (error) {
// //     console.error("Error generating mock interview:", error);
// //     throw new Error("Failed to generate mock interview questions");
// //   }
// // }
// // // actions/mockInterview.js

// // export async function getMockInterviews() {
// //   const { userId } = await auth();
// //   if (!userId) throw new Error("Unauthorized");

// //   const user = await db.user.findUnique({
// //     where: { clerkUserId: userId },
// //   });
// //   if (!user) throw new Error("User not found");

// //   try {
// //     return await db.mockInterviewAssessment.findMany({
// //       where: { userId: user.id },
// //       orderBy: { createdAt: "desc" },
// //     });
// //   } catch (error) {
// //     console.error("Error fetching mock interviews:", error);
// //     throw new Error("Failed to fetch mock interview results");
// //   }
// // }
// // export { generateMockInterview, getMockInterviews };
// // "use server";

// // import { db } from "@/lib/prisma";
// // import { auth } from "@clerk/nextjs/server";
// // import { GoogleGenerativeAI } from "@google/generative-ai";

// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// // const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// // /**
// //  * Step 1: Generate mock interview questions
// //  */
// // export async function generateMockInterview(formData) {
// //   const { userId } = await auth();
// //   if (!userId) throw new Error("Unauthorized");

// //   // Use formData if passed, else fallback to last interviewForm
// //   let form;
// //   if (formData) {
// //     form = formData;
// //   } else {
// //     const latestForm = await db.interviewForm.findFirst({
// //       where: { userId },
// //       orderBy: { createdAt: "desc" },
// //     });
// //     if (!latestForm) throw new Error("No interview form found");
// //     form = {
// //       type: latestForm.type,
// //       industry: latestForm.industry || "",
// //       role: latestForm.role || "",
// //       project: latestForm.project,
// //       experience: latestForm.experience,
// //       skills: latestForm.skills || [],
// //       numQuestions: latestForm.numQuestions,
// //     };
// //   }

// //   // Full detailed prompt
// //   const prompt = `
// // You are a highly experienced professional interviewer with expertise in real-world interviews.

// // Generate a ${form.type} mock interview with ${form.numQuestions} realistic questions for a ${form.industry} role: ${form.role}.  
// // Candidate has ${form.experience} years of experience, worked on project: ${form.project}, ${
// //     form.skills.length ? `and has skills: ${form.skills.join(", ")}.` : ""
// //   }

// // Rules:
// // 1. First question must always be "Tell me about yourself" (unless coding type).
// // 2. Questions must match type: behavioral, technical, or coding.
// // 3. Provide ideal answers for each question.
// // 4. Return ONLY valid JSON strictly following this format:

// // {
// //   "questions": [
// //     { "question": "string", "idealAnswer": "string" }
// //   ]
// // }
// // `;

// //   try {
// //     const result = await model.generateContent(prompt);
// //     const text = result.response.text();
// //     const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

// //     // Safe JSON parsing
// //     let mock;
// //     try {
// //       mock = JSON.parse(cleanedText);
// //     } catch (e) {
// //       console.error("Failed to parse AI JSON:", cleanedText);
// //       throw new Error("AI response was not valid JSON");
// //     }

// //     if (!mock.questions || !Array.isArray(mock.questions)) {
// //       console.error("AI returned invalid questions array:", mock);
// //       throw new Error("AI did not return a valid questions array");
// //     }

// //     return mock.questions;
// //   } catch (error) {
// //     console.error("Error generating mock interview:", error);
// //     throw new Error("Failed to generate mock interview questions");
// //   }
// // }

// // /**
// //  * Step 2: Save mock interview results
// //  */
// // export async function saveMockInterviewResult(questions, userAnswers) {
// //   if (!Array.isArray(questions)) {
// //     console.error("saveMockInterviewResult received invalid questions:", questions);
// //     throw new Error("Questions must be an array");
// //   }

// //   const { userId } = await auth();
// //   if (!userId) throw new Error("Unauthorized");

// //   const user = await db.user.findUnique({
// //     where: { clerkUserId: userId },
// //   });
// //   if (!user) throw new Error("User not found");

// //   const evaluated = questions.map((q, idx) => ({
// //     question: q.question,
// //     idealAnswer: q.idealAnswer,
// //     userAnswer: userAnswers?.[idx] || "",
// //   }));

// //   try {
// //     const assessment = await db.mockInterviewAssessment.create({
// //       data: {
// //         userId: user.id,
// //         questions: evaluated,
// //         category: "Mock Interview",
// //       },
// //     });
// //     return assessment;
// //   } catch (error) {
// //     console.error("Error saving mock interview result:", error);
// //     throw new Error("Failed to save mock interview result");
// //   }
// // }

// // /**
// //  * Step 3: Get all mock interview assessments
// //  */
// // export async function getMockInterviews() {
// //   const { userId } = await auth();
// //   if (!userId) throw new Error("Unauthorized");

// //   const user = await db.user.findUnique({
// //     where: { clerkUserId: userId },
// //   });
// //   if (!user) throw new Error("User not found");

// //   try {
// //     return await db.mockInterviewAssessment.findMany({
// //       where: { userId: user.id },
// //       orderBy: { createdAt: "desc" },
// //     });
// //   } catch (error) {
// //     console.error("Error fetching mock interviews:", error);
// //     throw new Error("Failed to fetch mock interview results");
// //   }
// // }
// "use server";

// // import { db } from "@/lib/prisma";
// // import { auth } from "@clerk/nextjs/server";
// // import { GoogleGenerativeAI } from "@google/generative-ai";

// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// // const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// /**
//  * Generate mock interview questions based on form data or last saved form.
//  */
// // export async function generateMockInterview(formData) {
// //   const { userId } = await auth();
// //   if (!userId) throw new Error("Unauthorized");

// //   let form;
// //   if (formData) {
// //     form = formData;
// //   } else {
// //     const latestForm = await db.interviewForm.findFirst({
// //       where: { userId },
// //       orderBy: { createdAt: "desc" },
// //     });
// //     if (!latestForm) throw new Error("No interview form found");

// //     form = {
// //       type: latestForm.type,
// //       industry: latestForm.industry || "",
// //       role: latestForm.role || "",
// //       project: latestForm.project,
// //       experience: latestForm.experience,
// //       skills: latestForm.skills || [],
// //       numQuestions: latestForm.numQuestions,
// //     };
// //   }

// //   // Full prompt including all rules and objectives
// //   const prompt = `
// // You are a highly experienced professional interviewer with expertise in conducting real-world interviews.

// // Generate a ${form.type} mock interview with ${form.numQuestions} realistic and challenging questions for a ${form.industry} role: ${form.role}.  
// // The candidate has ${form.experience} years of professional experience, has worked on a project (${form.project}), ${
// //     form.skills.length
// //       ? `and possesses strong skills in ${form.skills.join(", ")}.`
// //       : "and no specific skills."
// //   }

// // ---

// // ### 🎯 Objective
// // You must generate realistic, conversational interview questions and corresponding ideal answers based on the provided form data.

// // ---

// // ### 🧩 Rules & Structure

// // #### 1. Interview Type Rules
// // - If ${form.type} = **"behavioral"**:
// //   - Ask **HR-style, real-world** questions testing communication, teamwork, leadership, adaptability, decision-making, and conflict resolution.
// //   - The **first question must always be:** “Tell me about yourself.”

// // - If ${form.type} = **"technical"**:
// //   - Ask **only technical questions** related to ${form.skills}, ${form.role}, and ${form.industry}.
// //   - The **first question must always be:** “Tell me about yourself.”

// // - If ${form.type} = **"coding"**:
// //   - Ask **only coding questions** (no theory or HR). Use ${form.skills}.
// //   - Do **not** include “Tell me about yourself” or behavioral/project questions.

// // ---

// // #### 2. Question Composition
// // - If ${form.project} is provided and not empty:
// //   - Maintain a **70:30 ratio**:
// //     - 70% skill-based/fundamental questions from ${form.skills}, ${form.role}, ${form.industry}.
// //     - 30% project-based/scenario-driven questions from ${form.project}.
// // - Else:
// //   - Ask **only skill-based/fundamental questions**.

// // ---

// // #### 3. Question Count Rules
// // - If ${form.numQuestions} > 9:
// //   - Include **1–2 short coding/problem-solving questions**.
// //   - Must clearly state: “Please write or explain your approach to…”

// // ---

// // #### 4. Tone & Style
// // - Questions must sound **natural, professional, and conversational**.
// // - Avoid robotic, repetitive, or exam-style phrasing.

// // ---

// // #### 5. Answer Quality
// // - For every question, generate an "idealAnswer" that is **strong, concise, and realistic**.
// // - Answers must be **clear, relevant, and specific**.

// // ---

// // #### 6. Output Format
// // Return **only valid JSON** in this format:

// // {
// //   "questions": [
// //     {
// //       "question": "string",
// //       "idealAnswer": "string"
// //     }
// //   ]
// // }
// // `;

// //   try {
// //     const result = await model.generateContent(prompt);
// //     const text = result.response.text();
// //     const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

// //     let mock;
// //     try {
// //       mock = JSON.parse(cleanedText);
// //     } catch (e) {
// //       console.error("Failed to parse AI JSON:", cleanedText);
// //       throw new Error("AI response was not valid JSON");
// //     }

// //     if (!Array.isArray(mock.questions)) {
// //       console.error("AI returned invalid questions array:", mock);
// //       throw new Error("Questions must be an array");
// //     }

// //     return mock.questions;
// //   } catch (error) {
// //     console.error("Error generating mock interview:", error);
// //     throw new Error("Failed to generate mock interview questions");
// //   }
// // }

// // Helper function to safely parse AI JSON response

// "use server";

// import { db } from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// // Helper to safely parse AI JSON response
// function parseAIQuestions(aiResponseText) {
//   try {
//     const cleaned = aiResponseText.replace(/```(?:json)?\n?/g, "").trim();
//     const parsed = JSON.parse(cleaned);

//     if (!parsed || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
//       console.warn("AI returned invalid or empty questions, wrapping in single-item array");
//       return [{ question: cleaned, idealAnswer: "" }];
//     }

//     return parsed.questions;
//   } catch (e) {
//     console.error("Failed to parse AI JSON, wrapping in single-item array:", aiResponseText);
//     return [{ question: aiResponseText, idealAnswer: "" }];
//   }
// }

// export async function generateMockInterview(formData) {
//   const { userId } = await auth();
//   if (!userId) throw new Error("Unauthorized");

//   // Use formData if passed, else fallback to last interviewForm
//   let form;
//   if (formData) {
//     form = formData;
//   } else {
//     const latestForm = await db.interviewForm.findFirst({
//       where: { userId },
//       orderBy: { createdAt: "desc" },
//     });
//     if (!latestForm) throw new Error("No interview form found");

//     form = {
//       type: latestForm.type,
//       industry: latestForm.industry || "",
//       role: latestForm.role || "",
//       project: latestForm.project || "",
//       experience: latestForm.experience || 0,
//       skills: latestForm.skills || [],
//       numQuestions: latestForm.numQuestions || 5,
//     };
//   }

//   // FULL prompt with all your rules
//   const prompt = `
// You are a highly experienced professional interviewer with expertise in conducting real-world interviews.

// Generate a ${form.type} mock interview with ${form.numQuestions} realistic and challenging questions for a ${form.industry} role: ${form.role}.  
// The candidate has ${form.experience} years of professional experience, has worked on a project (${form.project}), ${
//     form.skills.length ? `and possesses strong skills in ${form.skills.join(", ")}.` : ""
//   }

// ---

// ### 🎯 Objective
// You must generate realistic, conversational interview questions and corresponding ideal answers based on the provided form data.

// ---

// ### 🧩 Rules & Structure

// #### 1. Interview Type Rules
// - If ${form.type} = "behavioral":
//   - Ask HR-style, real-world questions testing communication, teamwork, leadership, adaptability, decision-making, and conflict resolution.
//   - The first question must always be: "Tell me about yourself."

// - If ${form.type} = "technical":
//   - Ask only technical questions related to ${form.skills}, ${form.role}, and ${form.industry}.
//   - The first question must always be: "Tell me about yourself."

// - If ${form.type} = "coding":
//   - Ask only coding questions (no theory or HR) from ${form.skills}.
//   - Do not include "Tell me about yourself" or project-based questions.

// #### 2. Question Composition
// - If ${form.project} is provided:
//   - Maintain a 70:30 ratio:
//     - 70% skill-based or fundamental questions derived from ${form.skills}, ${form.role}, and ${form.industry}.
//     - 30% project-based or scenario-driven questions focused on ${form.project}.
// - Else:
//   - Ask only skill-based or fundamental questions.

// #### 3. Question Count Rules
// - If ${form.numQuestions} > 9:
//   - Include 1–2 simple short coding or problem-solving questions.
//   - Clearly state: "Please write or explain your approach to..."

// #### 4. Tone & Style
// - Questions must sound natural, professional, and conversational.
// - Avoid robotic, repetitive, or exam-style phrasing.

// #### 5. Answer Quality
// - Each question must have an "idealAnswer" that is strong, concise, and realistic.

// #### 6. Output Format
// Return only valid JSON:
// {
//   "questions": [
//     { "question": "string", "idealAnswer": "string" }
//   ]
// }
// No extra commentary or markdown.
// `;

//   try {
//     const result = await model.generateContent(prompt);
//     const text = result.response.text();
//     const questionsArray = parseAIQuestions(text);

//     return questionsArray;
//   } catch (error) {
//     console.error("Error generating mock interview:", error);
//     throw new Error("Failed to generate mock interview questions");
//   }
// }

// // function parseAIQuestions(aiResponseText) {
// //   try {
// //     const cleaned = aiResponseText.replace(/```(?:json)?\n?/g, "").trim();
// //     const parsed = JSON.parse(cleaned);

// //     if (!parsed || !Array.isArray(parsed.questions)) {
// //       console.warn("AI did not return an array of questions, wrapping in a single-item array");
// //       return [{ question: cleaned, idealAnswer: "" }];
// //     }

// //     if (parsed.questions.length === 0) {
// //       console.warn("AI returned empty questions array, wrapping in single-item array");
// //       return [{ question: "No question generated", idealAnswer: "" }];
// //     }

// //     return parsed.questions;
// //   } catch (e) {
// //     console.error("Failed to parse AI JSON, wrapping in single-item array:", aiResponseText);
// //     return [{ question: aiResponseText, idealAnswer: "" }];
// //   }
// // }

// // Usage in generateMockInterview
// // const aiResult = await model.generateContent(prompt);
// // const text = aiResult.response.text();
// // const questionsArray = parseAIQuestions(text);

// // // Now questionsArray is always a non-empty array
// // return questionsArray;
// // /**
// //  * Save user answers and evaluated mock interview
// //  */
// // // export async function saveMockInterviewResult(questions, userAnswers) {
// // //   if (!Array.isArray(questions)) {
// // //     console.error("saveMockInterviewResult received invalid questions:", questions);
// // //     throw new Error("Questions must be an array");
// // //   }

// // //   const { userId } = await auth();
// // //   if (!userId) throw new Error("Unauthorized");

// // //   const user = await db.user.findUnique({
// // //     where: { clerkUserId: userId },
// // //   });
// // //   if (!user) throw new Error("User not found");

// // //   const evaluated = questions.map((q, idx) => ({
// // //     question: q.question,
// // //     idealAnswer: q.idealAnswer,
// // //     userAnswer: userAnswers[idx] || "",
// // //   }));

// // //   // Generate feedback using AI
// // //   const feedbackPrompt = `
// // // The candidate answered the following mock interview questions:

// // // ${evaluated
// // //   .map(
// // //     (q, i) => `
// // // Q${i + 1}: ${q.question}
// // // Ideal Answer: ${q.idealAnswer}
// // // Candidate Answer: ${q.userAnswer}`
// // //   )
// // //   .join("\n\n")}

// // // Task:
// // // - Provide short, specific feedback for each answer (1–2 sentences).
// // // - Suggest ONE overall improvement tip (max 5 sentences) based on Communication, Technical Skills, Problem Solving.
// // // - Evaluate if the answer is correct with boolean value;
// // // - Give a score out of 100;

// // // Return strictly in JSON format:
// // // {
// // //   "feedback": ["string", "string", ...],
// // //   "improvementTip": "string",
// // //   "isCorrect": [true,false,...],
// // //   "interviewScore": number
// // // }
// // // `;

// // //   let feedbackData = { feedback: [], improvementTip: "", isCorrect: [], interviewScore: 0 };
// // //   try {
// // //     const feedbackResult = await model.generateContent(feedbackPrompt);
// // //     const text = feedbackResult.response.text();
// // //     const cleaned = text.replace(/```(?:json)?\n?/g, "").trim();
// // //     feedbackData = JSON.parse(cleaned);
// // //   } catch (error) {
// // //     console.error("Error generating feedback:", error);
// // //   }

// // //   const finalResults = evaluated.map((q, i) => ({
// // //     ...q,
// // //     feedback: feedbackData.feedback?.[i] || null,
// // //     isCorrect: feedbackData.isCorrect?.[i] || false,
// // //   }));

// // //   try {
// // //     const assessment = await db.mockInterviewAssessment.create({
// // //       data: {
// // //         userId: user.id,
// // //         questions: finalResults,
// // //         category: "Mock Interview",
// // //         improvementTip: feedbackData.improvementTip,
// // //         interviewScore: feedbackData.interviewScore,
// // //       },
// // //     });

// // //     return assessment;
// // //   } catch (error) {
// // //     console.error("Error saving mock interview result:", error);
// // //     throw new Error("Failed to save mock interview result");
// // //   }
// // // }
// export async function saveMockInterviewResult(questions, userAnswers) {
//   // Ensure we received an array
//   const questionsArray = Array.isArray(questions) ? questions : [];
//   if (questionsArray.length === 0) {
//     console.error("saveMockInterviewResult received invalid or empty questions:", questions);
//     throw new Error("Questions must be a non-empty array");
//   }

//   const { userId } = await auth();
//   if (!userId) throw new Error("Unauthorized");

//   const user = await db.user.findUnique({ where: { clerkUserId: userId } });
//   if (!user) throw new Error("User not found");

//   // Attach user answers and prepare for AI feedback
//   const evaluated = questionsArray.map((q, idx) => ({
//     question: q.question,
//     idealAnswer: q.idealAnswer,
//     userAnswer: userAnswers?.[idx] || "",
//   }));

//   // Prepare feedback prompt
//   const feedbackPrompt = `
// The candidate answered the following mock interview questions:

// ${evaluated
//   .map(
//     (q, i) => `
// Q${i + 1}: ${q.question}
// Ideal Answer: ${q.idealAnswer}
// Candidate Answer: ${q.userAnswer}`
//   )
//   .join("\n\n")}

// Task:
// - Provide short, specific feedback for each answer (1–2 sentences).
// - Suggest ONE overall improvement tip (max 5 sentences) based on Communication, Technical Skills, Problem Solving.
// - Evaluate if the answer is correct (true/false).
// - Give score out of 100.

// Return strictly in JSON format:
// {
//   "feedback": ["string", ...],
//   "improvementTip": "string",
//   "isCorrect": [true,false,...],
//   "interviewScore": number
// }
// `;

//   // Generate AI feedback
//   let feedbackData = { feedback: [], improvementTip: "", isCorrect: [], interviewScore: 0 };
//   try {
//     const feedbackResult = await model.generateContent(feedbackPrompt);
//     const rawText = feedbackResult.response.text();
//     const cleanedText = rawText.replace(/```(?:json)?\n?/g, "").trim();

//     try {
//       feedbackData = JSON.parse(cleanedText);
//     } catch (e) {
//       console.error("Failed to parse AI feedback JSON:", cleanedText);
//     }
//   } catch (error) {
//     console.error("Error generating AI feedback:", error);
//   }

//   // Combine questions, user answers, and AI feedback
//   const finalResults = evaluated.map((q, i) => ({
//     ...q,
//     feedback: feedbackData.feedback?.[i] || null,
//     isCorrect: feedbackData.isCorrect?.[i] || false,
//   }));

//   // Save to database
//   try {
//     const assessment = await db.mockInterviewAssessment.create({
//       data: {
//         userId: user.id,
//         questions: finalResults,
//         category: "Mock Interview",
//         improvementTip: feedbackData.improvementTip || "",
//         interviewScore: feedbackData.interviewScore || 0,
//       },
//     });
//     return assessment;
//   } catch (error) {
//     console.error("Error saving mock interview result:", error);
//     throw new Error("Failed to save mock interview result");
//   }
// }

// /**
//  * Fetch all mock interview assessments for the current user
//  */
// export async function getMockInterviews() {
//   const { userId } = await auth();
//   if (!userId) throw new Error("Unauthorized");

//   const user = await db.user.findUnique({
//     where: { clerkUserId: userId },
//   });
//   if (!user) throw new Error("User not found");

//   try {
//     return await db.mockInterviewAssessment.findMany({
//       where: { userId: user.id },
//       orderBy: { createdAt: "desc" },
//     });
//   } catch (error) {
//     console.error("Error fetching mock interviews:", error);
//     throw new Error("Failed to fetch mock interview results");
//   }
// }

"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Step 1: Generate mock interview questions
 */
export async function generateMockInterview(formData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Use formData if passed, else fallback to last interviewForm
  let form;
  if (formData) {
    form = formData;
  } else {
    const latestForm = await db.interviewForm.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    if (!latestForm) throw new Error("No interview form found");
    form = {
      type: latestForm.type,
      industry: latestForm.industry || "",
      role: latestForm.role || "",
      project: latestForm.project,
      experience: latestForm.experience,
      skills: latestForm.skills || [],
      numQuestions: latestForm.numQuestions,
    };
  }

  const prompt = `You are a highly experienced professional interviewer with expertise in conducting real-world interviews.

Generate a ${form.type} mock interview with ${form.numQuestions} realistic and challenging questions for a ${form.industry} role: ${form.role}.  
The candidate has ${form.experience} years of professional experience, has worked on a project (${form.project}), ${
  form.skills.length
    ? `and possesses strong skills in ${form.skills.join(", ")}.`
    : ""
}

---

### 🎯 Objective
You must generate realistic, conversational interview questions and corresponding ideal answers based on the provided form data.

---

### 🧩 Rules & Structure

#### 1. Interview Type Rules
- If ${form.type} = **"behavioral"**:
  - Ask **HR-style, real-world** questions testing communication, teamwork, leadership, adaptability, decision-making, and conflict resolution.
  - The **first question must always be:** “Tell me about yourself.”

- If ${form.type} = **"technical"**:
  - Ask **only technical questions** related to ${form.skills}, ${form.role}, and ${form.industry}.
  - Then, follow the **Question Composition** rule below.
  -The **first question must always be:** “Tell me about yourself.”
- If ${form.type} = **"coding"**:
  - Ask **only coding questions** (no theory or HR). from ${form.skills}.
  - Do **not** include “Tell me about yourself,” behavioral, or project-based questions.

---

#### 2. Question Composition
- If ${form.project} is provided and not an empty string (""):
  - Maintain a **70:30 ratio**:
    - 70% skill-based or fundamental questions derived from ${form.skills}, ${form.role}, and ${form.industry}.
    - 30% project-based or scenario-driven questions focused on ${form.project}.
- Else:
  - Ask **only** skill-based or fundamental questions derived from ${form.skills}, ${form.role}, and ${form.industry}.

---

#### 3. Question Count Rules
- If ${form.numQuestions} > 9:
  - Include **1–2 simple short coding or problem-solving questions**.
  - These must clearly state: “Please write or explain your approach to…”

---

#### 4. Tone & Style
- Questions must sound **natural, professional, and conversational** — like an actual interviewer.
- Avoid robotic, repetitive, or exam-style phrasing.
- Maintain logical flow and engagement throughout the interview.

---

#### 5. Answer Quality
- For every question, generate an "idealAnswer" that reflects a **strong, concise, and realistic** response from a well-prepared candidate.
- Answers should be **clear, relevant, and specific** to the question.

---

#### 6. Output Format
- Return **only valid JSON**, with no extra commentary, explanations, or markdown.
- Follow this exact format:

{
  "questions": [
    {
      "question": "string",
      "idealAnswer": "string"
    }
  ]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const mock = JSON.parse(cleanedText);

    return mock.questions;
  } catch (error) {
    console.error("Error generating mock interview:", error);
    throw new Error("Failed to generate mock interview questions");
  }
}

export async function saveMockInterviewResult(questions, userAnswers) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  // Evaluate responses
  const evaluated = questions.map((q, idx) => ({
    question: q.question,
    idealAnswer: q.idealAnswer,
    userAnswer: userAnswers[idx] || "",
  }));

  const feedbackPrompt = `
  The candidate answered the following mock interview questions:

  ${evaluated
    .map(
      (q, i) => `
      Q${i + 1}: ${q.question}
      Ideal Answer: ${q.idealAnswer}
      Candidate Answer: ${q.userAnswer}
      `
    )
    .join("\n\n")}

  Task:
  - Provide short, specific feedback for each answer (1–2 sentences).
  - Suggest ONE overall improvement tip (max 5 sentences) based on Communication,Technical Skills,Problem Solving.
  - Evaluate if the answer is correct or not with boolean value;
  - Give score of 100;
  
  Return strictly in JSON format:
  {
    "feedback": ["string", "string", ...],
    "improvementTip": "string"
    " isCorrect: boolen"
    "interviewscore:number"
  }
  `;

  let feedbackData = { feedback: [], improvementTip: null };
  try {
    const feedbackResult = await model.generateContent(feedbackPrompt);
    const text = feedbackResult.response.text();
    const cleaned = text.replace(/```(?:json)?\n?/g, "").trim();
    feedbackData = JSON.parse(cleaned);
  } catch (error) {
    console.error("Error generating feedback:", error);
  }

  // Attach feedback to answers
  const finalResults = evaluated.map((q, i) => ({
    ...q,
    feedback: feedbackData.feedback?.[i] || null,
    isCorrect: feedbackData.isCorrect?.[i] || false,
  }));

  try {
    const assessment = await db.mockInterviewAssessment.create({
      data: {
        userId: user.id,
        questions: finalResults,
        category: "Mock Interview",
        improvementTip: feedbackData.improvementTip,
        interviewscore: feedbackData.interviewscore,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving mock interview result:", error);
    throw new Error("Failed to save mock interview result");
  }
}

/**
 * Step 3: Get all mock interview assessments
 */
export async function getMockInterviews() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  try {
    return await db.mockInterviewAssessment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching mock interviews:", error);
    throw new Error("Failed to fetch mock interview results");
  }
}