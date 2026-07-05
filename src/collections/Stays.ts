import type { CollectionConfig } from 'payload'

export const Stays: CollectionConfig = {
  slug: 'stays',
  labels: { singular: 'Stay', plural: 'Stays' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'ownership', 'location', 'starRating', 'status'],
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'ownership',
      type: 'select',
      required: true,
      defaultValue: 'partner',
      options: [
        { label: 'Kartikart-owned', value: 'owned' },
        { label: 'Partner', value: 'partner' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'location', type: 'text', defaultValue: 'Deoghar' },
        { name: 'starRating', type: 'number', min: 1, max: 5 },
      ],
    },
    { name: 'amenities', type: 'array', fields: [{ name: 'item', type: 'text' }] },
    { name: 'photos', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media' }] },
    { name: 'shortDesc', type: 'textarea' },
    { name: 'description', type: 'richText' },
    {
      type: 'row',
      fields: [
        { name: 'priceFrom', type: 'number', admin: { description: 'Starting price in ₹' } },
        { name: 'priceNote', type: 'text', admin: { description: 'e.g. "per night"' } },
      ],
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
