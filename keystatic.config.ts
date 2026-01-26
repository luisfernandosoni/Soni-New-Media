import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'cloud',
  },
  cloud: {
    project: 'soni-new-media/archive-v1',
  },
  collections: {
    posts: collection({
      label: 'Archive (Blog)',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({ label: 'Date' }),
        cover: fields.image({
          label: 'Cover Image',
          directory: 'public/assets/blog',
          publicPath: '/assets/blog/',
        }),
        excerpt: fields.text({ label: 'Excerpt', multiline: true }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'public/assets/blog',
            publicPath: '/assets/blog/',
          },
        }),
      },
    }),
  },
});