import { defineType, defineField } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Categorie',
  type: 'document',
  fields: [
    defineField({ name: 'naam', title: 'Naam (NL)', type: 'string', validation: r => r.required() }),
    defineField({ name: 'naamEn', title: 'Naam (EN)', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'naam' }, validation: r => r.required() }),
    defineField({ name: 'beschrijving', title: 'Beschrijving (NL)', type: 'text' }),
    defineField({ name: 'beschrijvingEn', title: 'Beschrijving (EN)', type: 'text' }),
    defineField({ name: 'afbeelding', title: 'Afbeelding', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'volgorde', title: 'Volgorde', type: 'number', initialValue: 0 }),
  ],
  preview: {
    select: { title: 'naam', media: 'afbeelding' },
  },
})
