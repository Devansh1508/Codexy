import {ai} from "./config/gemini.js";
import { count_Tokens } from "./config/gemini.js";
import { CONFIG } from "./config.js";
import { BASE_PROMPT } from "./prompt.js";
import { basePrompt as NODE_BASE_PROMPT } from "./default/node.js";
import { basePrompt as REACT_BASE_PROMPT } from "./default/react.js";
import express from "express";
import templateRoutes from "./routes/template.js"; 
import chatRoutes from "./routes/chat.js"; 
import cors from "cors";
require("dotenv").config();
// The client gets the API key from the environment variable `GEMINI_API_KEY`.

const prompt_text="create a todo app.";
// const token_Input=count_tokens(prompt_text);

const app=express();
app.use(cors({
    origin:'http://localhost:5173'
}));
app.use(express.json());
app.use("/api/v1/template",templateRoutes);
app.use("/api/v1/chat",chatRoutes);

app.listen(3000);
console.log("Server started on port 3000");


// calling the main function 
// async function main(text:string) {
//   const token_Input=await count_Tokens(text);
  
//   try{
//     if(token_Input===-1){
//       throw new Error("Token counting failed");
//     }
//   }catch(err){
//     console.log("Error in counting tokens:",err);
//     return;
//   }

//   if(token_Input>CONFIG.MAX_INPUT_TOKEN){
//     console.log("Input token limit exceeded");
//     return;
//   }

//   // response in the form of stream of data 
//   const response = await ai.models.generateContentStream({
//     model: CONFIG.model_name,
//     contents: [
//       // previous user message
//       { 
//         role: 'user',
//         parts: [{ 
//           text: BASE_PROMPT
//        }] },
//       // assistant reply (you can include to continue from it)
//       { role: 'user', parts: [{ text: `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${REACT_BASE_PROMPT}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n` }] },
      
//       // user Prompt 
//       { role: 'user', parts: [{ text: prompt_text }] },
//     ],
//     config: {
//       maxOutputTokens: CONFIG.MAX_OUTPUT_TOKEN,
//       thinkingConfig: {
//         thinkingBudget: CONFIG.thinking_Budget // Disables thinking
//       },
//     },
//   });

//   try{
//     for await (const chunk of response) {
//       console.log(chunk.text);
//     }
//   }catch(err){
//     console.log("Error in streaming response:",err);
//     return;
//   }
// }

// main(prompt_text);

