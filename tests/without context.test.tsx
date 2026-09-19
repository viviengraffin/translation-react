// deno-lint-ignore-file jsx-curly-braces require-await
import {
  TranslationBuilder,
  TranslationReact,
} from "@viviengraffin/translation-react";
import translations from "./datas/react/translation.ts";
import { assertEquals, assertRejects } from "@std/assert";
import React from "react";
import { TestEnvironment } from "./lib.ts";

async function buildInstance(
  callback: (builder: TranslationBuilder<TranslationReact>) => void = () => {},
) {
  const builder = new TranslationBuilder(TranslationReact)
    .withTranslations(translations)
    .withEnvironment(TestEnvironment)
    .withFallbackLocale("fr");

  callback(builder);

  return await builder.build();
}

Deno.test("TranslationReact - translates a key", async () => {
  const instance = await buildInstance();
  assertEquals(instance.translate("hello.world"), <h1>Bonjour le monde</h1>);
});

Deno.test("TranslationReact - interpolates translation data", async () => {
  const instance = await buildInstance();
  assertEquals(
    instance.translate("hello.people", { name: "John" }),
    <h1>Bonjour {"John"}</h1>,
  );
});

Deno.test("TranslationReact - uses fallback locale", async () => {
  const instance = await buildInstance((builder) =>
    builder.withLocale("fr").withFallbackLocale("en")
  );
  assertEquals(instance.translate("hello.universe"), <h1>Hello Universe</h1>);
});

Deno.test("TranslationReact - rejects when translation does not exist", async () => {
  const instance = await buildInstance();
  await assertRejects(async () => instance.translate("unknown"));
});

Deno.test("TranslationReact - rejects when fallback locale does not exist", async () => {
  await assertRejects(async () =>
    buildInstance((builder) => builder.withFallbackLocale("unknown"))
  );
});

Deno.test("TranslationReact - updates when locale changes", async () => {
  const instance = await buildInstance();

  assertEquals(instance.translate("hello.world"), <h1>Bonjour le monde</h1>);
  await instance.setLocale("en");

  assertEquals(instance.translate("hello.world"), <h1>Hello world</h1>);
});

Deno.test("TranslationReact - uses another separator", async () => {
  const instance = await buildInstance((builder) => builder.withSeparator("-"));

  assertEquals(instance.translate("hello-world"), <h1>Bonjour le monde</h1>);
});
