import type {Preview} from "@storybook/react";
import {initialize, mswLoader} from 'msw-storybook-addon'
import {wirespecGenerator} from "wirespec-msw"
import {seededFaker} from "wirespec-generator"

import '../src/index.css';

initialize();

export const customGeneratorMap: Record<string, (seed: number) => any> = {
    "City": (seed: number) => seededFaker(seed).location.city(),
    "Street": (seed: number) => seededFaker(seed).location.street(),
    "PostalCode": (seed: number) => seededFaker(seed).location.zipCode(),
    "Country": (seed: number) => seededFaker(seed).location.country(),
    "Email": (seed: number) => seededFaker(seed).internet.email(),
    "FullName": (seed: number) => seededFaker(seed).person.fullName(),
    //"Person": (seed: number) => ({hello: seed}),
}

const handlers = await wirespecGenerator({input: "/spec/todo.ws", seed:"ijnfviwjfvwvwfk", customGeneratorMap})

const preview: Preview = {
    parameters: {
        actions: {argTypesRegex: "^on[A-Z].*"},
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        msw: {
            handlers
        },
    },
    loaders: [mswLoader],
};

export default preview;
