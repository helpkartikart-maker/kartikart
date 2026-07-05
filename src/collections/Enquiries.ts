import type { CollectionConfig } from 'payload'

/**
 * Leads captured when a visitor taps "Book on WhatsApp". Rows are created
 * server-side via the Local API (Phase 3 route), which bypasses `create`
 * access — so public REST/GraphQL creation stays disabled here.
 */
export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  labels: { singular: 'Enquiry', plural: 'Enquiries' },
  admin: {
    useAsTitle: 'subjectRef',
    defaultColumns: ['subjectType', 'subjectRef', 'name', 'phone', 'createdAt'],
    group: 'Leads',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'phone', type: 'text' },
      ],
    },
    {
      name: 'subjectType',
      type: 'select',
      required: true,
      options: [
        { label: 'Package', value: 'package' },
        { label: 'Car', value: 'car' },
        { label: 'Hotel', value: 'hotel' },
        { label: 'Experience', value: 'experience' },
        { label: 'Custom', value: 'custom' },
      ],
    },
    {
      name: 'subjectRef',
      type: 'text',
      admin: { description: 'Package title / car / hotel referenced by the enquiry' },
    },
    { name: 'message', type: 'textarea' },
    {
      type: 'row',
      fields: [
        { name: 'travelers', type: 'number' },
        { name: 'dates', type: 'text' },
      ],
    },
  ],
}
