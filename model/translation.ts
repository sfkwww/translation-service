import { Schema, model } from "mongoose";

export const translation = new Schema({
  key: String,
  id: String,
  translation: String,
});

export interface Translation {
  key: string;
  id: string;
  translation: string;
}

export const translationDB = model("translations", translation);
