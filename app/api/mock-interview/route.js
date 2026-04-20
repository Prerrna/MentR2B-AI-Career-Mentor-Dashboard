import { saveMockInterviewResult } from "@/actions/mock-interview";

export async function POST(req) {
  const body = await req.json();

  const result = await saveMockInterviewResult(
    body.questions,
    body.answers
  );

  return Response.json(result);
}