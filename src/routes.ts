import express, { Router } from "express";
import authRoutes from "./routes/authRoutes";

const router: Router = express.Router();

router.use("", authRoutes);

export default router;
