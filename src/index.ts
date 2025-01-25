import express from "express";
import routes from "./routes";
import { connectDB } from "./config/database";
import { config } from "dotenv";

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/v1", routes);

connectDB()
  .then(() => {
    console.log("Connected to DB.");

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
    console.error("Failed to connect to DB...");
  });
