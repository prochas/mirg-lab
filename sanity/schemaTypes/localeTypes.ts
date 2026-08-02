import { defineArrayMember, defineField, defineType } from 'sanity'
import { locales, defaultLocale } from '../../i18n/routing'

/**
 * Translatable fields, stored as `{ lt, en }` objects on the document itself.
 *
 * The locale list is imported from `i18n/routing` rather than duplicated, so
 * adding a third locale to the app adds the field here automatically — Studio
 * and the front end can never disagree about which locales exist.
 *
 * Only the default locale is required. An unfinished English translation should
 * be a publishable draft, not a validation error that blocks the Lithuanian shop
 * from going live; `localize()` in `lib/rings.ts` falls back to the default
 * locale when a translation is missing.
 *
 * The three field builders below are deliberately written out rather than
 * generated from one helper — `defineField` is a discriminated union on `type`,
 * so a helper that returns a widened `'string' | 'text' | 'array'` stops
 * type-checking the rest of the field.
 */

const LOCALE_TITLES: Record<(typeof locales)[number], string> = {
  lt: 'Lietuvių',
  en: 'English',
}

const isDefault = (locale: (typeof locales)[number]) => locale === defaultLocale

const OPTIONS = { collapsible: true, collapsed: false } as const

/** Short single-line copy — titles, material names. */
export const localeString = defineType({
  name: 'localeString',
  title: 'Localised text',
  type: 'object',
  options: OPTIONS,
  fields: locales.map((locale) =>
    defineField({
      name: locale,
      title: LOCALE_TITLES[locale],
      type: 'string',
      validation: (Rule) => (isDefault(locale) ? Rule.required() : Rule),
    }),
  ),
})

/** Multi-line prose — product descriptions. */
export const localeText = defineType({
  name: 'localeText',
  title: 'Localised paragraph',
  type: 'object',
  options: OPTIONS,
  fields: locales.map((locale) =>
    defineField({
      name: locale,
      title: LOCALE_TITLES[locale],
      type: 'text',
      rows: 4,
      validation: (Rule) => (isDefault(locale) ? Rule.required() : Rule),
    }),
  ),
})

/** Bullet lists — the spec rows rendered in the product-page accordion. */
export const localeStringList = defineType({
  name: 'localeStringList',
  title: 'Localised list',
  type: 'object',
  options: OPTIONS,
  fields: locales.map((locale) =>
    defineField({
      name: locale,
      title: LOCALE_TITLES[locale],
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (Rule) => (isDefault(locale) ? Rule.required().min(1) : Rule),
    }),
  ),
})
