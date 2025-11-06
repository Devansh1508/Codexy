import { Request,Response } from "express"
import {ai} from "../config/gemini.js";
import { CONFIG } from "../config.js";
import { getSystemPrompt } from "../prompt.js";


const chatController=async (req: Request, res: Response)=>{
    const prompt=req.body.prompt;

    const response = await ai.models.generateContent({
        model: CONFIG.model_name,
        contents: prompt,
        config: {
            systemInstruction: getSystemPrompt(),
            maxOutputTokens: CONFIG.MAX_OUTPUT_TOKEN,
        }
    });

    res.json({
        response: response
    });
}

export {chatController};