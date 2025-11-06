import {template} from "../controllers/template.js";
import express from "express";
const router=express.Router();

router.post("/checkAppType",template);

export default router;