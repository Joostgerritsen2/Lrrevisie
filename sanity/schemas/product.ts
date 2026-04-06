import { defineType, defineField } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({ name: 'naam', title: 'Naam (NL)', type: 'string', validation: r => r.required() }),
    defineField({ name: 'naamEn', title: 'Naam (EN)', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'naam' }, validation: r => r.required() }),
    defineField({ name: 'artikelnummer', title: 'Artikelnummer / OEM Code', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'prijs',
      title: 'Prijs (in centen, bijv. 2495 = €24,95)',
      type: 'number',
      validation: r => r.required().min(0),
    }),
    defineField({ name: 'saleProijs', title: 'Aanbiedingsprijs (centen)', type: 'number' }),
    defineField({
      name: 'categorie',
      title: 'Categorie',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: r => r.required(),
    }),
    defineField({ name: 'afbeeldingen', title: 'Afbeeldingen', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'beschrijving', title: 'Beschrijving (NL)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'beschrijvingEn', title: 'Beschrijving (EN)', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'specificaties',
      title: 'Specificaties',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label' },
            { name: 'waarde', type: 'string', title: 'Waarde' },
          ],
        },
      ],
    }),
    defineField({
      name: 'compatibiliteit',
      title: 'Compatibele voertuigen',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Bijv. "Land Rover Defender 90/110 (1983-2006)"',
    }),
    defineField({ name: 'inVoorraad', title: 'Op voorraad', type: 'boolean', initialValue: true }),
    defineField({ name: 'seoTitle', title: 'SEO Titel', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'SEO Beschrijving', type: 'text' }),
    defineField({
      name: 'gerelateerdeProducten',
      title: 'Gerelateerde producten',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
    }),
  ],
  preview: {
    select: { title: 'naam', subtitle: 'artikelnummer', media: 'afbeeldingen.0' },
  },
})
