import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, address } = body;

    if (!message || !address) {
      return NextResponse.json({
        success: false,
        error: "Missing required parameters",
      }, { status: 400 });
    }

    const systemPrompt = `You are a highly intelligent system designed to extract a single person's name from user input and replace it with a provided address. If a name is found in the message, replace it with the address and return the modified message in the following strict JSON format:
{
  "updatedMessage": "messageWithReplacedName"
}

For example, if the input message is "Send 100 to John" and the address is "0x123", return:
{
  "updatedMessage": "Send 100 to 0x123"
}

If no name is found, return the original message in the same format:
{
  "updatedMessage": "${message}"
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
      {
        role: "user",
        content: `Replace any found name with this address: ${address}`,
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

    try {
      const extractedJson = JSON.parse(messageContent);
      if (!extractedJson.updatedMessage) {
        throw new Error("Response missing updatedMessage field");
      }
      return NextResponse.json({
        success: true,
        fullResponse: response,
        parsedJson: extractedJson,
      });
    } catch (error) {
      console.error("JSON parsing error:", error);
      // Fallback to original message if parsing fails
      return NextResponse.json({
        success: true,
        fullResponse: response,
        parsedJson: { updatedMessage: message },
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
