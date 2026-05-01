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
              type: 'array',
              of: [
                {
                  type: 'block',
                  marks: {
                    annotations: [
                      {
                        name: 'link',
                        type: 'object',
                        title: 'Link',
                        fields: [
                          defineField({
                            name: 'href',
                            type: 'url',
                            title: 'URL',
                            validation: (Rule) =>
                              Rule.uri({
                                scheme: ['http', 'https', 'mailto', 'tel'],
                              }),
                          }),
                        ],
                      },
                    ],
                  },
                },
              ],
              description: 'Shown as the slide headline. You can add links to selected words.',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'array',
              of: [
                {
                  type: 'block',
                  marks: {
                    annotations: [
                      {
                        name: 'link',
                        type: 'object',
                        title: 'Link',
                        fields: [
                          defineField({
                            name: 'href',
                            type: 'url',
                            title: 'URL',
                            validation: (Rule) =>
                              Rule.uri({
                                scheme: ['http', 'https', 'mailto', 'tel'],
                              }),
                          }),
                        ],
                      },
                    ],
                  },
                },
              ],
              description: 'Caption text. You can add links to selected words.',
            }),
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              validation: (Rule) => Rule.required(),
              description: 'Required plain-text description for accessibility and screen readers.',
            }),
          ],
          preview: {
            select: { title: 'title.0.children.0.text', subtitle: 'alt', media: 'image' },
            prepare({ title, subtitle, media }) {
              return { title: title || subtitle || 'Slide', subtitle, media };
            },
          },
        },
      ],
    }),
  ],
});
