import express from "express";
import { config } from "dotenv";
config({ path: "../.env" });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
