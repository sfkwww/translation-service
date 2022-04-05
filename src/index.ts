import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Translation, translationDB } from "../model/translation";
const mongoose = require("mongoose");

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const toHide = { _id: 0, __v: 0 };

interface TranslationRequest {
  id: string;
  key: string;
}

mongoConnect();

function mongoConnect() {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch(console.log);
}

app.use(express.json());

app.post("/", async (req: Request<null, Translation>, res: Response) => {
  const { id, key, translation } = req.body;
  const result = await translationDB
    .findOneAndUpdate(
      { id, key, translation },
      { id, key, translation },
      { new: true, upsert: true, projection: toHide }
    )
    .catch((err) => {
      console.log("Error adding translation to DB.");
      return err;
    });
  res.send(result);
});

app.get(
  "/",
  async (req: Request<null, null, null, TranslationRequest>, res: Response) => {
    const { id, key } = req.query;
    const result = await translationDB
      .findOne({ id, key }, { translation: 1 })
      .then((doc) => {
        if (!doc) return new Error("Translation not found.");
        return doc.translation;
      })
      .catch((err) => {
        console.log(`Error finding translation for id: ${id}, key: ${key}`);
        return err;
      });
    res.send(result);
  }
);

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
