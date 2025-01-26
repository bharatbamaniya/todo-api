import express from "express";
import routes from "./routes";
import CronService from './services/cronService';
import { connectDB } from "./config/database";
import { config } from "dotenv";
import { globalErrorHandler } from "./utils/asyncHandler";

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/v1", routes);

app.use(globalErrorHandler);

connectDB()
    .then(() => {
        console.log("Connected to DB.");

        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
            if (process.env.CRON_ENABLED === 'true') CronService.getInstance();
        });
    })
    .catch((err) => {
        console.error(err);
        console.error("Failed to connect to DB...");
    });

export default app;
