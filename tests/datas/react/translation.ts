import type { TranslationObjectByLocale } from "@viviengraffin/translation-core";
import type { ReactElement } from "react";
import defer * as frObject from "./fr.tsx";
import defer * as enObject from "./en.tsx";

export default {
  fr: () => frObject.default,
  en: () => enObject.default,
} satisfies TranslationObjectByLocale<ReactElement>;
