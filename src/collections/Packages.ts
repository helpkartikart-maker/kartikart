import type { CollectionConfig } from 'payload'
import { slugField } from '../lib/slug'

export const Packages: CollectionConfig = {
  slug: 'packages',
  labels: { singular: 'Package', plural: 'Packages' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'region', 'status', 'featured'],
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
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
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Spiritual', value: 'spiritual' },
        { label: 'Adventure', value: 'adventure' },
        { label: 'Wildlife', value: 'wildlife' },
        { label: 'Beach', value: 'beach' },
        { label: 'Cultural', value: 'cultural' },
        { label: 'Rentals', value: 'rental' },
      ],
    },
    {
      name: 'suitedFor',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Families', value: 'families' },
        { label: 'Couples', value: 'couples' },
        { label: 'Groups', value: 'groups' },
        { label: 'Solo Travelers', value: 'solo' },
      ],
    },
    {
      name: 'region',
      type: 'select',
      required: true,
      defaultValue: 'deoghar',
      options: [
        { label: 'Deoghar & Local', value: 'deoghar' },
        { label: 'Pan-India', value: 'pan-india' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'durationDays', type: 'number' },
        { name: 'durationNights', type: 'number' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'priceFrom', type: 'number', admin: { description: 'Starting price in ₹' } },
        {
          name: 'compareAtPrice',
          type: 'number',
          admin: { description: 'Original price, shown struck through (optional — for a discount)' },
        },
        { name: 'priceNote', type: 'text', admin: { description: 'e.g. "per cab" or "per person"' } },
      ],
    },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'gallery', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media' }] },
    { name: 'shortPitch', type: 'textarea' },
    { name: 'description', type: 'richText' },
    { name: 'highlights', type: 'array', fields: [{ name: 'item', type: 'text' }] },
    {
      name: 'itinerary',
      type: 'array',
      labels: { singular: 'Day', plural: 'Days' },
      fields: [
        { name: 'day', type: 'number' },
        { name: 'title', type: 'text' },
        { name: 'details', type: 'textarea' },
      ],
    },
    { name: 'inclusions', type: 'array', fields: [{ name: 'item', type: 'text' }] },
    { name: 'exclusions', type: 'array', fields: [{ name: 'item', type: 'text' }] },
  ],
}
