import type { Field } from 'payload'

/** Turn any string into a URL-safe slug: lowercase, non-alphanumerics → single dashes. */
export function formatSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** A reusable `slug` field that auto-fills from a sibling `title` when left empty. */
export function slugField(): Field {
  return {
    name: 'slug',
    type: 'text',
    required: true,
    unique: true,
    index: true,
    admin: { position: 'sidebar' },
    hooks: {
      beforeValidate: [
        ({ value, data }) => value || (data?.title ? formatSlug(String(data.title)) : value),
      ],
    },
  }
}
