import type { TranslationObject } from "@viviengraffin/translation-core";
import type { ReactElement } from "react";
import type { HelloPeopleArgs } from "./types.ts";

export default {
  hello: {
    world: <h1>Hello world</h1>,
    people: ({ name }: HelloPeopleArgs) => <h1>Hello {name}</h1>,
    universe: <h1>Hello Universe</h1>,
  },
} satisfies TranslationObject<ReactElement>;
