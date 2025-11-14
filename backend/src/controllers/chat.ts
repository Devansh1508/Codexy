import { Request, Response } from "express";
import { ai } from "../config/gemini.js";
import { CONFIG } from "../config.js";
import { getSystemPrompt } from "../prompt.js";

const chatController = async (req: Request, res: Response) => {
  try {
    // messages contains the array of messages from the user
    // and each message has role and content
    const messages = req.body.messages;

    const response = await ai.models.generateContent({
      model: CONFIG.model_name,
      contents: messages,
      config: {
        systemInstruction: getSystemPrompt(),
        maxOutputTokens: CONFIG.MAX_OUTPUT_TOKEN_CHAT,
      },
    });

    res.json({
      response: response.candidates?.[0]?.content?.parts?.[0]?.text,
    });
    return;
  } catch (error) {
    console.error("Error in chat controller:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export { chatController };
