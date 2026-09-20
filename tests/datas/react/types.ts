import type { JSX } from "react";

export type HelloPeopleArgs = { name: string };

export type TranslationType = {
  hello?: {
    world?: JSX.Element;
    people?: (args: HelloPeopleArgs) => JSX.Element;
    universe?: JSX.Element;
  };
};
