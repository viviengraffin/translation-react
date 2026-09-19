import type { HelloPeopleArgs, TranslationType } from "./types.ts";
import React from "react";

export default {
  hello: {
    world: <h1>Hello world</h1>,
    people: ({ name }) => <h1>Hello {name}</h1>,
    universe: <h1>Hello Universe</h1>,
  },
} satisfies TranslationType;
