import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.warn("OPENAI_API_KEY not set. Agents will use mock data.");
}

export const openai = apiKey
  ? new OpenAI({ apiKey })
  : (null as unknown as OpenAI);

export async function callAgent(
  systemPrompt: string,
  userContent: string,
  jsonMode = true
): Promise<string> {
  if (!openai) {
    throw new Error("OPENAI_API_KEY is required. Set it in .env.local");
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    response_format: jsonMode ? { type: "json_object" } : undefined,
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response from OpenAI");
  }
  return content;
}
