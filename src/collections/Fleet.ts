import type { CollectionConfig } from 'payload'

export const Fleet: CollectionConfig = {
  slug: 'fleet',
  labels: { singular: 'Car', plural: 'Fleet' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'seats', 'ownedByKartikart', 'status'],
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true, admin: { description: 'e.g. Toyota Innova Crysta' } },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'SUV', value: 'suv' },
        { label: 'Sedan', value: 'sedan' },
        { label: 'Tempo Traveller', value: 'tempo' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'seats', type: 'number' },
        { name: 'luggage', type: 'text', admin: { description: 'e.g. 3 bags' } },
      ],
    },
    { name: 'features', type: 'array', fields: [{ name: 'item', type: 'text' }] },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'gallery', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media' }] },
    {
      type: 'row',
      fields: [
        { name: 'rate', type: 'number', admin: { description: 'Numeric rate in ₹' } },
        { name: 'rateNote', type: 'text', admin: { description: 'e.g. "per km" or "on request"' } },
      ],
    },
    {
      name: 'ownedByKartikart',
      type: 'checkbox',
      defaultValue: false,
      label: 'Owned by Kartikart',
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
  ],
}
