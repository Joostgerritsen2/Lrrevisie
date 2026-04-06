import { defineType, defineField } from 'sanity'

export const settings = defineType({
  name: 'settings',
  title: 'Site-instellingen',
  type: 'document',
  // @ts-expect-error __experimental_actions is not in the type definitions but is supported at runtime
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({ name: 'gratisverzendingVanaf', title: 'Gratis verzending vanaf (centen)', type: 'number', initialValue: 7500 }),
    defineField({ name: 'verzendkostenNL', title: 'Verzendkosten NL (centen)', type: 'number', initialValue: 695 }),
    defineField({ name: 'verzendkostenBE', title: 'Verzendkosten BE (centen)', type: 'number', initialValue: 995 }),
    defineField({ name: 'eigenaarFoto', title: 'Foto eigenaar', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'eigenaarNaam', title: 'Naam eigenaar', type: 'string' }),
    defineField({ name: 'eigenaarBio', title: 'Bio eigenaar (NL)', type: 'text' }),
  ],
})
