import express, { Router } from "express";
import authRoutes from "./routes/authRoutes";
import todoRoutes from "./routes/todoRoutes";

const router: Router = express.Router();

router.use("", authRoutes);
router.use("/todos", todoRoutes);

export default router;
