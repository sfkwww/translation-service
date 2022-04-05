import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import {
  AddTranslationRequestSchema,
  GetTranslationRequestSchema,
  Translation,
} from "../model/translation";
import { TranslationService } from "./translationService";
import { Schema } from "joi";

const mongoose = require("mongoose");

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const toHide = { _id: 0, __v: 0 };

interface TranslationRequest {
  id: string;
  key: string;
}

app.use(express.json());
mongoConnect();

function mongoConnect() {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch(console.log);
}

function attachStatusToResponse(
  err: Error & { statusCode?: number },
  res: Response
) {
  res.status(err.statusCode ?? 500);
}

function constructError(err: Error) {
  return { error: err.message };
}

function handleError(err: Error & { statusCode?: number }, res: Response) {
  attachStatusToResponse(err, res);
  return constructError(err);
}

function validateSchema(schema: Schema, payload: any) {
  const validationResult = schema.validate(payload);
  const error = validationResult.error;
  if (error) {
    throw new Error(error.message);
  }
}

const translationService = new TranslationService();

app.post("/", async (req: Request<null, Translation>, res: Response) => {
  try {
    validateSchema(AddTranslationRequestSchema, req.body);
  } catch (err) {
    if (err instanceof Error) res.send(handleError(err, res));
    return;
  }

  const result = await translationService
    .addTranslation(req.body)
    .catch((err) => handleError(err, res));
  res.send(result);
});

app.get(
  "/",
  async (req: Request<null, null, null, TranslationRequest>, res: Response) => {
    try {
      validateSchema(GetTranslationRequestSchema, req.query);
    } catch (err) {
      if (err instanceof Error) res.send(handleError(err, res));
      return;
    }

    const { id, key } = req.query;
    const result = await translationService
      .getTranslation(id, key)
      .catch((err) => handleError(err, res));
    res.send(result);
  }
);

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
