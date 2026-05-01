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
              description: 'Optional image title with inline links for selected words.',
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
              description: 'Caption text with optional inline links.',
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
            select: {
              title: 'title.0.children.0.text',
              subtitle: 'alt',
              media: 'image',
            },
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
