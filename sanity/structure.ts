import type { StructureResolver } from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('mirga.lab')
    .items([
      S.listItem()
        .title('Rings')
        .schemaType('product')
        .child(
          // Same order the catalog uses, so Studio matches the shop.
          S.documentTypeList('product')
            .title('Rings')
            .defaultOrdering([
              { field: 'order', direction: 'asc' },
              { field: 'title.lt', direction: 'asc' },
            ]),
        ),
      S.documentTypeListItem('material').title('Materials'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['product', 'material'].includes(item.getId()!),
      ),
    ])
