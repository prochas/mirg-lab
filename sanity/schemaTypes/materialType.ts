import { defineField, defineType } from 'sanity'

/**
 * A metal / finish the rings are made from.
 *
 * `key` is the locale-stable identity the catalog filters on — the visible
 * label is translated, the key never is. Matching filters on the translated
 * label would silently break the moment a label is reworded, so nothing
 * downstream is allowed to depend on `title`.
 */
export const materialType = defineType({
  name: 'material',
  title: 'Material',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Name',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'key',
      title: 'Filter key',
      type: 'slug',
      description:
        'Stable id used by the catalog filter, e.g. "silver-925". Set once and leave it alone — changing it drops the filter chip for every product using it.',
      options: {
        source: (doc) => (doc.title as { lt?: string } | undefined)?.lt ?? '',
        maxLength: 40,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title.lt', subtitle: 'key.current' },
  },
})
