import { Schema, model } from "mongoose";
import Joi from "joi";

const translation = new Schema({
  key: String,
  id: String,
  translation: String,
});

export interface Translation {
  key: string;
  id: string;
  translation: string;
}

export const AddTranslationRequestSchema = Joi.object({
  key: Joi.string().alphanum().required(),
  id: Joi.string().alphanum().required(),
  translation: Joi.string().required(),
});

export const GetTranslationRequestSchema = Joi.object({
  key: Joi.string().alphanum().required(),
  id: Joi.string().alphanum().required(),
});

export const translationDB = model("translations", translation);
