import { type SchemaTypeDefinition } from 'sanity'

import { localeString, localeText, localeStringList } from './localeTypes'
import { materialType } from './materialType'
import { productType } from './productType'

// The blog starter types (post / author / category / blockContent) were removed —
// this is a jewelry shop, and unused document types just clutter Studio.
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [localeString, localeText, localeStringList, materialType, productType],
}
