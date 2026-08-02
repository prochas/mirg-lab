import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * A ring. The single source of truth for the catalog.
 *
 * Two invariants the front end depends on:
 *
 * 1. `slug` is shared across locales — one canonical URL per product, and cart
 *    keys (`slug + size`) survive a language switch. There is deliberately no
 *    per-locale slug field.
 * 2. `images` is positional: [0] is the card front, [1] is the card hover swap,
 *    the rest are gallery-only. Reordering the array changes the card.
 *
 * Stock is *not* modelled — every ring is always orderable. `ready` only
 * changes which fulfilment message the customer sees; see lib/fulfillment.ts.
 */
export const productType = defineType({
  name: 'product',
  title: 'Ring',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'commerce', title: 'Price & sizes' },
    { name: 'media', title: 'Photos' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Name',
      type: 'localeString',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      group: 'content',
      description:
        'Shared by both languages — /products/<slug> and /en/products/<slug>. Changing it breaks existing links and any cart already holding this ring.',
      options: {
        source: (doc) => (doc.title as { lt?: string } | undefined)?.lt ?? '',
        maxLength: 60,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'material',
      title: 'Material',
      type: 'reference',
      to: [{ type: 'material' }],
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localeText',
      group: 'content',
      description: 'The paragraph under the price on the product page.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'details',
      title: 'Spec bullets',
      type: 'localeStringList',
      group: 'content',
      description:
        'Shown in the "Specification" accordion. Keep both languages the same length.',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'price',
      title: 'Price (EUR)',
      type: 'number',
      group: 'commerce',
      description: 'Whole euros, e.g. 145. Converted to cents server-side for Stripe.',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'sizeOptions',
      title: 'Available sizes',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      group: 'commerce',
      description: 'The sizes a customer can pick, e.g. 16, 17, 18.',
      validation: (Rule) => Rule.required().min(1).unique(),
    }),
    defineField({
      name: 'ready',
      title: 'A finished one is on hand',
      type: 'boolean',
      group: 'commerce',
      initialValue: false,
      description:
        'Tick only if a physical, finished ring exists right now. This changes the delivery message, never whether it can be ordered.',
    }),
    defineField({
      name: 'readySize',
      title: 'Size of the finished one',
      type: 'string',
      group: 'commerce',
      hidden: ({ document }) => !document?.ready,
      // Required when `ready`, and it has to be a size the customer can
      // actually pick — otherwise getFulfillment() can never return
      // "ready_exact" and the ready flag is silently meaningless.
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const doc = context.document as
            | { ready?: boolean; sizeOptions?: string[] }
            | undefined
          if (!doc?.ready) return true
          if (!value) return 'Set the size of the finished ring.'
          if (doc.sizeOptions?.length && !doc.sizeOptions.includes(value)) {
            return `"${value}" is not one of the available sizes (${doc.sizeOptions.join(', ')}).`
          }
          return true
        }),
    }),

    defineField({
      name: 'images',
      title: 'Photos',
      type: 'array',
      group: 'media',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
      description:
        'Order matters: 1st is the card photo, 2nd shows on hover, the rest are gallery only.',
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: 'featured',
      title: 'Show on the home page',
      type: 'boolean',
      group: 'content',
      initialValue: false,
      description: 'The home page shows the first four featured rings.',
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      group: 'content',
      description:
        'Lower comes first in the catalog’s default sort. Ties fall back to name.',
      initialValue: 0,
    }),
  ],

  orderings: [
    {
      name: 'catalogOrder',
      title: 'Catalog order',
      by: [
        { field: 'order', direction: 'asc' },
        { field: 'title.lt', direction: 'asc' },
      ],
    },
    { name: 'priceAsc', title: 'Price, low to high', by: [{ field: 'price', direction: 'asc' }] },
    { name: 'priceDesc', title: 'Price, high to low', by: [{ field: 'price', direction: 'desc' }] },
  ],

  preview: {
    select: {
      title: 'title.lt',
      price: 'price',
      ready: 'ready',
      media: 'images.0',
    },
    prepare({ title, price, ready, media }) {
      return {
        title,
        subtitle: [price ? `${price} €` : null, ready ? 'Paruošta' : 'Gaminama']
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  },
})
