import TranslationReact from "@/class.ts";
import {
  DEFAULT_FALLBACK_LOCALE,
  loader as getTranslationObjects,
  TranslationBuilder,
  type TranslationContainer,
  TranslationNamespaces,
} from "@viviengraffin/translation-core/frontend";
import {
  createContext,
  type JSX,
  type PropsWithChildren,
  type ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";

type TranslationReactContextValue = {
  t(key: string, datas?: Record<string, unknown>): ReactElement | string;
  setLocale(locale?: string): void;
  setNamespaces(namespaces: string[]): void;
  addNamespaces(...namespaces: string[]): void;
  removeNamespaces(...namespaces: string[]): void;
};

type TranslationReactProviderArgs = PropsWithChildren<{
  translations: TranslationContainer<ReactElement>;
  locale?: string;
  fallbackLocale?: string;
  onLocaleChange?: (locale: string | undefined) => void;
  onTranslationsChange?: (
    translations: TranslationContainer<ReactElement>,
  ) => void;
}>;

const TranslationReactContext = createContext<
  TranslationReactContextValue | null
>(null);

/**
 * Provides access to the translation API from a React component.
 *
 * This hook must be used inside a {@link TranslationReactProvider}.
 *
 * @returns The translation context containing the translation function
 * and locale/namespace management methods.
 *
 * @throws {Error} If the hook is called outside of a
 * {@link TranslationReactProvider}.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { t } = useTranslation();
 *
 *   return <h1>{t("home.title")}</h1>;
 * }
 * ```
 */
export function useTranslation(): TranslationReactContextValue {
  const translationContext = useContext(TranslationReactContext);

  if (translationContext === null) {
    throw new Error(
      `useTranslation must be called inside a TranslationReactProvider`,
    );
  }

  return translationContext;
}

/**
 * Provides translations to its child React components.
 *
 * The provider initializes the translation system using the provided
 * translations and locale, then exposes the translation API through
 * {@link useTranslation}.
 *
 * The translation instance is rebuilt when `translations`, `locale`,
 * or `fallbackLocale` changes.
 *
 * @param props - Provider configuration and child components.
 *
 * @example
 * ```tsx
 * <TranslationReactProvider
 *   translations={translations}
 *   locale="fr"
 *   fallbackLocale="en"
 * >
 *   <App />
 * </TranslationReactProvider>
 * ```
 *
 * @example
 * ```tsx
 * <TranslationReactProvider
 *   translations={translations}
 *   locale="fr"
 *   onLocaleChange={(locale) => {
 *     console.log("Locale changed:", locale);
 *   }}
 * >
 *   <App />
 * </TranslationReactProvider>
 * ```
 */
export function TranslationReactProvider(
  {
    translations,
    locale,
    fallbackLocale = DEFAULT_FALLBACK_LOCALE,
    children,
    onLocaleChange = () => {},
    onTranslationsChange = () => {},
  }: TranslationReactProviderArgs,
): JSX.Element | null {
  const [instance, setInstance] = useState<TranslationReact | null>(null);

  const t = (
    key: string,
    datas?: Record<string, unknown>,
  ): ReactElement | string => {
    if (instance === null) {
      return key;
    }

    const translated = instance.safeTranslate(key, datas);

    if (translated.success) {
      return translated.result;
    }

    return key;
  };

  const setLocale = (locale?: string | undefined) => {
    onLocaleChange(locale);
  };

  function passIfHaveNamespaces(
    translations: TranslationContainer<ReactElement>,
  ): translations is TranslationNamespaces<ReactElement> {
    if (!(translations instanceof TranslationNamespaces)) {
      throw new Error("The translations have no namespaces.");
    }

    return true;
  }

  const setNamespaces = (namespaces: string[]) => {
    if (passIfHaveNamespaces(translations)) {
      translations.setNamespaces(namespaces);
      onTranslationsChange(translations.copy());
    }
  };

  const addNamespaces = (...namespaces: string[]) => {
    if (passIfHaveNamespaces(translations)) {
      translations.addNamespaces(...namespaces);
      onTranslationsChange(translations.copy());
    }
  };

  const removeNamespaces = (...namespaces: string[]) => {
    if (passIfHaveNamespaces(translations)) {
      translations.removeNamespaces(...namespaces);
      onTranslationsChange(translations.copy());
    }
  };

  useEffect(() => {
    let cancelled = false;

    new TranslationBuilder(TranslationReact)
      .withLoader(getTranslationObjects)
      .withTranslations(translations)
      .withLocale(locale)
      .withFallbackLocale(fallbackLocale)
      .build()
      .then((instance) => {
        if (cancelled) return;
        setInstance(instance);
      });

    return () => {
      cancelled = true;
    };
  }, [translations, locale, fallbackLocale]);

  if (instance === null) return null;

  return (
    <TranslationReactContext.Provider
      value={{
        setLocale,
        t,
        setNamespaces,
        addNamespaces,
        removeNamespaces,
      }}
    >
      {children}
    </TranslationReactContext.Provider>
  );
}
