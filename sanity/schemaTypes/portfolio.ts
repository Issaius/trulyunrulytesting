import { defineField, defineType } from 'sanity';

export const portfolio = defineType({
  name: 'portfolio',
  title: 'Portfolio',
  type: 'document',
  fields: [
    defineField({
      name: 'intro',
      title: 'Intro text',
      type: 'text',
      rows: 3,
      description: 'Optional copy above the gallery.',
    }),
    defineField({
      name: 'images',
      title: 'Gallery images',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'portfolioImage',
          title: 'Image',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Alt text and optional label.',
            }),
          ],
          preview: {
            select: { title: 'caption', media: 'image' },
            prepare({ title, media }) {
              return { title: title || 'Image', media };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Portfolio' };
    },
  },
});
