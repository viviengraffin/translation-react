import { assertEquals, assertRejects, assertThrows } from "@std/assert";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";

import { TranslationReactProvider, useTranslation } from "@/context.tsx";

import translations from "./datas/react/translation.ts";

let elementNumber = 0;

Deno.test("TranslationReactProvider - renders children after initialization", async () => {
  render(
    <TranslationReactProvider translations={translations}>
      <div data-testid={(++elementNumber).toString()}>Hello</div>
    </TranslationReactProvider>,
  );

  await waitFor(() => {
    assertEquals(
      screen.getByTestId(elementNumber.toString()).textContent,
      "Hello",
    );
  });
});

Deno.test("TranslationReactProvider - translates a key", async () => {
  function TestComponent() {
    const { t } = useTranslation();

    return (
      <div data-testid={(++elementNumber).toString()}>{t("hello.world")}</div>
    );
  }

  render(
    <TranslationReactProvider
      translations={translations}
      locale="fr"
    >
      <TestComponent />
    </TranslationReactProvider>,
  );

  await waitFor(() => {
    assertEquals(
      screen.getByTestId(elementNumber.toString()).textContent,
      "Bonjour le monde",
    );
  });
});

Deno.test("TranslationReactProvider - returns key when translation does not exist", async () => {
  function TestComponent() {
    const { t } = useTranslation();

    return (
      <div data-testid={(++elementNumber).toString()}>{t("unknown.key")}</div>
    );
  }

  render(
    <TranslationReactProvider
      translations={translations}
      locale="fr"
    >
      <TestComponent />
    </TranslationReactProvider>,
  );

  await waitFor(() => {
    assertEquals(
      screen.getByTestId(elementNumber.toString()).textContent,
      "unknown.key",
    );
  });
});

Deno.test("TranslationReactProvider - interpolates translation data", async () => {
  function TestComponent() {
    const { t } = useTranslation();

    return (
      <div data-testid={(++elementNumber).toString()}>
        {t("hello.people", { name: "John" })}
      </div>
    );
  }

  render(
    <TranslationReactProvider
      translations={translations}
      locale="fr"
    >
      <TestComponent />
    </TranslationReactProvider>,
  );

  await waitFor(() => {
    assertEquals(
      screen.getByTestId(elementNumber.toString()).textContent,
      "Bonjour John",
    );
  });
});

Deno.test("useTranslation - throws when used outside provider", () => {
  function TestComponent() {
    useTranslation();

    return <div>Should not render</div>;
  }

  assertRejects(
    () =>
      Promise.resolve().then(() => {
        render(<TestComponent />);
      }),
    Error,
    "useTranslation must be called inside a TranslationReactProvider",
  );
});

Deno.test("useTranslation outside provider", () => {
  function Component() {
    useTranslation();
    return <div>Should not render</div>;
  }

  assertThrows(() => {
    render(<Component />);
  });
});

Deno.test("TranslationReactProvider - setLocale calls onLocaleChange", async () => {
  let receivedLocale: string | undefined;

  function TestComponent() {
    const { setLocale } = useTranslation();

    return (
      <button
        type="button"
        data-testid={(++elementNumber).toString()}
        onClick={() => setLocale("en")}
      >
        Change locale
      </button>
    );
  }

  render(
    <TranslationReactProvider
      translations={translations}
      locale="fr"
      onLocaleChange={(locale) => {
        receivedLocale = locale;
      }}
    >
      <TestComponent />
    </TranslationReactProvider>,
  );

  await waitFor(() => {
    screen.getByTestId(elementNumber.toString());
  });

  screen.getByTestId(elementNumber.toString()).click();

  assertEquals(receivedLocale, "en");
});

Deno.test("TranslationReactProvider - setLocale accepts undefined", async () => {
  let receivedLocale: string | undefined = "fr";

  function TestComponent() {
    const { setLocale } = useTranslation();

    return (
      <button
        type="button"
        data-testid={(++elementNumber).toString()}
        onClick={() => setLocale()}
      >
        Reset locale
      </button>
    );
  }

  render(
    <TranslationReactProvider
      translations={translations}
      locale="fr"
      onLocaleChange={(locale) => {
        receivedLocale = locale;
      }}
    >
      <TestComponent />
    </TranslationReactProvider>,
  );

  await waitFor(() => {
    screen.getByTestId(elementNumber);
  });

  screen.getByTestId(elementNumber).click();

  assertEquals(receivedLocale, undefined);
});

Deno.test("TranslationReactProvider - updates when locale changes", async () => {
  function TestComponent() {
    const { t } = useTranslation();

    return <div data-testid="translation">{t("hello.world")}</div>;
  }

  const { rerender } = render(
    <TranslationReactProvider
      translations={translations}
      locale="fr"
    >
      <TestComponent />
    </TranslationReactProvider>,
  );

  await waitFor(() => {
    assertEquals(
      screen.getByTestId("translation").textContent,
      "Bonjour le monde",
    );
  });

  rerender(
    <TranslationReactProvider
      translations={translations}
      locale="en"
    >
      <TestComponent />
    </TranslationReactProvider>,
  );

  await waitFor(() => {
    assertEquals(
      screen.getByTestId("translation").textContent,
      "Hello world",
    );
  });
});

Deno.test("TranslationReactProvider - uses fallback locale", async () => {
  function TestComponent() {
    const { t } = useTranslation();

    return (
      <div data-testid={(++elementNumber).toString()}>
        {t("hello.universe")}
      </div>
    );
  }

  render(
    <TranslationReactProvider
      translations={translations}
      locale="fr"
      fallbackLocale="en"
    >
      <TestComponent />
    </TranslationReactProvider>,
  );

  await waitFor(() => {
    assertEquals(
      screen.getByTestId(elementNumber).textContent,
      "Hello Universe",
    );
  });
});
/*
Deno.test("TranslationReactProvider - setNamespaces does nothing without namespaces", async () => {
  let callbackCalled = false;

  function TestComponent() {
    const { setNamespaces } = useTranslation();

    return (
      <button type="button" data-testid={(++elementNumber).toString()} onClick={() => setNamespaces(["hello"])}>
        Set namespaces
      </button>
    );
  }

  render(
    <TranslationReactProvider
      translations={translations}
      onTranslationsChange={() => {
        callbackCalled = true;
      }}
    >
      <TestComponent />
    </TranslationReactProvider>,
  );

  await waitFor(async () => {
    screen.getByTestId(elementNumber.toString());
  });

  // Ici, ton implémentation appelle passIfHaveNamespaces()
  // qui doit lever une erreur.
  await assertRejects(async () => {
    screen.getByTestId(elementNumber).click();
  });

  assertEquals(callbackCalled, false);
});

Deno.test("TranslationReactProvider - addNamespaces does nothing without namespaces", async () => {
  function TestComponent() {
    const { addNamespaces } = useTranslation();

    return (
      <button type="button" data-testid={(++elementNumber).toString()} onClick={() => addNamespaces("hello")}>
        Add namespaces
      </button>
    );
  }

  render(
    <TranslationReactProvider translations={translations}>
      <TestComponent />
    </TranslationReactProvider>,
  );

  await waitFor(() => {
    screen.getByTestId(elementNumber.toString());
  });

  await assertRejects(async () => {
    screen.getByTestId(elementNumber.toString()).click();
  });
});

Deno.test("TranslationReactProvider - removeNamespaces does nothing without namespaces", async () => {
  function TestComponent() {
    const { removeNamespaces } = useTranslation();

    return (
      <button type="button" data-testid={(++elementNumber).toString()} onClick={() => removeNamespaces("hello")}>
        Remove namespaces
      </button>
    );
  }

  render(
    <TranslationReactProvider translations={translations}>
      <TestComponent />
    </TranslationReactProvider>,
  );

  await waitFor(() => {
    screen.getByTestId(elementNumber.toString());
  });

  await assertRejects(async () => {
    screen.getByTestId(elementNumber.toString()).click();
  });
});
*/
