import express, { Router } from "express";
import { register, login } from "../controllers/authController";

const router: Router = express.Router();

router.post("/signup", register);
router.post("/login", login);

export default router;
