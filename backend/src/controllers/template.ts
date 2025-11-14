import { ai } from "../config/gemini.js";
import { CONFIG } from "../config.js";
import { BASE_PROMPT } from "../prompt.js";
import { basePrompt as reactBasePrompt } from "../default/react.js";
import { basePrompt as nodeBasePrompt } from "../default/node.js";
import { Request, Response } from "express";

const template = async (req: Request, res: Response) => {
  try {
    console.log("Prompt received in template controller:");
    const prompt = req.body.prompt;

    const response = await ai.models.generateContent({
      model: CONFIG.model_name,
      contents: prompt,
      config: {
        systemInstruction:
          "Return either react or node on what do you think this project is based on. Only return a single word react or node. Do not return anything extra.",
        maxOutputTokens: CONFIG.MAX_OUTPUT_TOKEN_TEMPLATE,
      },
    });

    // console.log("Response from AI model in template controller:", response);

    const templateResponse =
      response.candidates?.[0]?.content?.parts?.[0]?.text;

    // console.log("just above the if else",response);
    if (templateResponse == "react") {
      // Handle react case
      res.json({
        prompts: [
          BASE_PROMPT,
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        // uiPrompts ---> files that need to be created, we need to render these file in a container
        uiPrompts: [reactBasePrompt],
      });
      return;
    } else if (templateResponse == "node") {
      // Handle node case
      // it is node project ---> node + react
      res.json({
        prompts: [
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [nodeBasePrompt],
      });
      return;
    }

    res.status(403).json({ message: "You cant access this" });
    return;
  } catch (err) {
    console.error("Error in template controller:", err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export { template };
