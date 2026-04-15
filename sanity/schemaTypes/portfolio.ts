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
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'Optional image title (same as Home Slider).',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Caption and image alt text (same as Home Slider).',
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'caption', media: 'image' },
            prepare({ title, subtitle, media }) {
              return { title: title || subtitle || 'Image', subtitle, media };
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
