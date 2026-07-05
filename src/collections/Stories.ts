import type { CollectionConfig } from 'payload'

export const Stories: CollectionConfig = {
  slug: 'stories',
  labels: { singular: 'Story', plural: 'Stories' },
  admin: {
    useAsTitle: 'customerName',
    defaultColumns: ['customerName', 'tripLabel', 'rating', 'status'],
  },
  access: { read: () => true },
  fields: [
    { name: 'customerName', type: 'text', required: true },
    {
      name: 'tripLabel',
      type: 'text',
      admin: { description: 'e.g. "Baba Baidyanath Darshan, Mar 2026"' },
    },
    {
      name: 'tripType',
      type: 'select',
      options: [
        { label: 'Spiritual', value: 'spiritual' },
        { label: 'Adventure', value: 'adventure' },
        { label: 'Wildlife', value: 'wildlife' },
        { label: 'Beach', value: 'beach' },
        { label: 'Cultural', value: 'cultural' },
      ],
    },
    { name: 'photos', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media' }] },
    { name: 'quote', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5 },
        { name: 'date', type: 'date' },
      ],
    },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
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
