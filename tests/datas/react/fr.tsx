import type { HelloPeopleArgs, TranslationType } from "./types.ts";
import React from "react";

export default {
  hello: {
    world: <h1>Bonjour le monde</h1>,
    people: ({ name }) => <h1>Bonjour {name}</h1>,
  },
} satisfies TranslationType;
