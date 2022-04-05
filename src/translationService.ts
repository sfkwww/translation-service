import { Translation, translationDB } from "../model/translation";

export class TranslationService {
  private toHide = { _id: 0, __v: 0 };

  private static throwWithStatus(status: number, msg: string) {
    throw Object.assign(new Error(msg), {
      statusCode: status,
    });
  }

  public getTranslation(id: string, key: string): Promise<string> {
    return translationDB
      .findOne({ id, key }, { translation: 1 })
      .then((doc) => {
        if (!doc)
          TranslationService.throwWithStatus(404, "Translation not found.");
        return doc.translation;
      })
      .catch((err) => {
        console.log(`Error finding translation for id: ${id}, key: ${key}`);
        throw err;
      });
  }

  public addTranslation(translation: Translation): Promise<Translation> {
    const { id, key } = translation;
    return translationDB
      .findOneAndUpdate({ id, key }, translation, {
        new: true,
        upsert: true,
        projection: this.toHide,
      })
      .catch((err) => {
        console.log("Error adding translation to DB.");
        throw err;
      });
  }
}
