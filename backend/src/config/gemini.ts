import { GoogleGenAI } from "@google/genai";
import { CONFIG } from "../config.js";
require("dotenv").config();

const ai = new GoogleGenAI({});

// basic utlity  to count tokens 
async function count_Tokens(text:string): Promise<number>{
  const client_token=await ai.models.countTokens({
    model: CONFIG.model_name,
    contents: text,
  });
  return client_token.totalTokens ?? -1;
}

export { count_Tokens, ai };

