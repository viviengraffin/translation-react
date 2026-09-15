import type { TranslationObject } from "@viviengraffin/translation-core";
import type { ReactElement } from "react";
import type { HelloPeopleArgs } from "./types.ts";

export default {
  hello: {
    world: <h1>Bonjour le monde</h1>,
    people: ({ name }: HelloPeopleArgs) => <h1>Bonjour {name}</h1>,
  },
} satisfies TranslationObject<ReactElement>;
