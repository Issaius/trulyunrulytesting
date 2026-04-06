import { defineField, defineType } from 'sanity';

export const homeSlider = defineType({
  name: 'homeSlider',
  title: 'Home Slider',
  type: 'document',
  fields: [
    defineField({
      name: 'slides',
      title: 'Slides',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'slide',
          title: 'Slide',
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
              description: 'Shown as the slide headline (replaces filename).',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Subtitle and image alt text for accessibility.',
            }),
          ],
          preview: {
            select: { title: 'title', media: 'image' },
            prepare({ title, media }) {
              return { title: title || 'Slide', media };
            },
          },
        },
      ],
    }),
  ],
});
