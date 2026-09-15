import {
  type Translation,
  TranslationBase,
  type TranslationObject,
} from "@viviengraffin/translation-core";
import { isValidElement, type ReactElement } from "react";

/**
 * React implementation of the translation class.
 *
 * This class extends {@link TranslationBase} to support translations
 * represented by React elements or translation functions.
 *
 * A translation can be either:
 * - A {@link ReactElement} returned directly.
 * - A function receiving translation data and returning a {@link ReactElement}.
 *
 * @example
 * ```tsx
 * const translations = {
 *   home: {
 *     title: <h1>Welcome</h1>,
 *     greeting: (datas) => <p>Hello {datas.name}</p>,
 *   },
 * };
 *
 * const translator = new TranslationReact(/* ... *\/);
 * ```
 */
export default class TranslationReact extends TranslationBase<ReactElement> {
  override manageTranslation(
    translation: Translation<ReactElement>,
    datas: Record<string, unknown>,
  ): ReactElement {
    switch (typeof translation) {
      case "function":
        return translation(datas);

      case "object":
        if (!isValidElement(translation)) {
          throw new Error(
            `Invalid translation: expected a JSX.Element or a translation function, received an object`,
          );
        }

        return translation;

      default:
        throw new Error(`Unexpected type received : ${typeof translation}`);
    }
  }

  protected override searchInTranslationObject(
    translationObject: TranslationObject<ReactElement>,
    keyParts: string[],
  ): Translation<ReactElement> | null {
    const { key, parts } = this.getKeyDatas(keyParts);

    switch (typeof translationObject[key]) {
      case "function":
        return translationObject[key];

      case "object":
        if (translationObject[key] === null) {
          return null;
        }

        if (isValidElement(translationObject[key])) {
          return translationObject[key];
        }

        return this.searchInTranslationObject(translationObject[key], parts);

      default:
        return null;
    }
  }
}
