import { login, signup } from "../controllers/auth.controller.js";
import express from "express";
const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
// router.get('/logout',logout)
export default router;
