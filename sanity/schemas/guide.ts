import { defineType, defineField } from 'sanity'

export const guide = defineType({
  name: 'guide',
  title: 'Technische Gids',
  type: 'document',
  fields: [
    defineField({ name: 'titel', title: 'Titel (NL)', type: 'string', validation: r => r.required() }),
    defineField({ name: 'titelEn', title: 'Titel (EN)', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'titel' }, validation: r => r.required() }),
    defineField({ name: 'seoDescription', title: 'SEO Beschrijving', type: 'text' }),
    defineField({ name: 'inhoud', title: 'Inhoud (NL)', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
    defineField({ name: 'inhoudEn', title: 'Inhoud (EN)', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
    defineField({
      name: 'relatedProducts',
      title: 'Gerelateerde producten',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
    }),
    defineField({ name: 'gepubliceerdOp', title: 'Gepubliceerd op', type: 'datetime' }),
  ],
})
