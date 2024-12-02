import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    const systemPrompt = `You are a highly intelligent system designed to extract a single person's name from user input. Analyze the user prompt to identify the name of the person mentioned. If a name is provided, return it in the following strict JSON format: {
  "name": <extracted_name>
}. If no name is provided, return this exact JSON: {
  "name": ""
}`;

    const messages = [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: message,
      },
    ];

    const curlCommand = `curl -s -X POST 'https://0x2b089f3dd0831077446a78a4c6632a14f72690d2.us.gaianet.network/v1/chat/completions' \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -d '${JSON.stringify({ messages }).replace(/'/g, "'\\''")}'`;

    const { stdout, stderr } = await execAsync(curlCommand);

    if (stderr && !stderr.includes("% Total") && !stderr.includes("Speed")) {
      console.error("Curl error:", stderr);
      throw new Error(stderr);
    }

    const response = JSON.parse(stdout);
    const messageContent = response.choices[0].message.content;
    console.log("Raw message content:", messageContent);

    // Try to parse the entire message content as JSON first
    try {
      const extractedJson = JSON.parse(messageContent);
      return NextResponse.json({
        success: true,
        fullResponse: response,
        parsedJson: extractedJson,
      });
    } catch (error) {
      // If direct parsing fails, try to extract JSON from markdown
      const jsonMatch =
        messageContent.match(/```json\n([\s\S]*?)\n```/) ||
        messageContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }
      const extractedJson = JSON.parse(jsonMatch[0]);
      return NextResponse.json({
        success: true,
        fullResponse: response,
        parsedJson: extractedJson,
      });
    }
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
