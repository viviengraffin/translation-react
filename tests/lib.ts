import { DEFAULT_FALLBACK_LOCALE, EnvironmentBase, Locale, toLocalArray, toUniqueArray } from "@viviengraffin/translation-react";

export class TestEnvironment extends EnvironmentBase {
  override getLocales({ locale, fallbackLocale = DEFAULT_FALLBACK_LOCALE }: { locale?: string; fallbackLocale?: string; }): Locale[] {
    return toLocalArray(toUniqueArray([
        ...(locale ? [locale] : []),
        fallbackLocale
    ]));
  }
}