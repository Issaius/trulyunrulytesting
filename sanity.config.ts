'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemaTypes';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  name: 'default',
  title: 'Truly Unruly',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Home Slider')
              .child(S.documentTypeList('homeSlider').title('Home Slider')),
            ...S.documentTypeListItems().filter((item) => item.getId() !== 'homeSlider'),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
