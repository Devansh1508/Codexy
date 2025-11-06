import express from "express";
import { chatController } from "../controllers/chat";
const router=express.Router();

router.post("/chatRoutes", chatController);

export default router;