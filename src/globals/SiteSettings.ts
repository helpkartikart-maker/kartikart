import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  admin: {
    description: 'Contact details, hero copy and social links used across the public site.',
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Hero & Brand',
      fields: [
        { name: 'brandTagline', type: 'text', defaultValue: 'Har Safar, Yaadgaar Safar' },
        {
          name: 'heroHeadline',
          type: 'text',
          defaultValue: 'Taxi se Hotel tak, Khana se Heritage tak',
        },
        { name: 'heroSubline', type: 'text', defaultValue: 'Sab Kuch Best, Sirf Aapke Liye!' },
        {
          name: 'heroImages',
          type: 'array',
          fields: [{ name: 'image', type: 'upload', relationTo: 'media' }],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Contact & Social',
      fields: [
        { name: 'phone', type: 'text', defaultValue: '+91 9304781234' },
        {
          name: 'whatsappNumber',
          type: 'text',
          required: true,
          defaultValue: '916201234567',
          admin: { description: 'Digits only, with country code (used for wa.me booking links).' },
        },
        { name: 'email', type: 'email' },
        { name: 'instagram', type: 'text', defaultValue: '@kartikart.travels' },
        { name: 'address', type: 'textarea', defaultValue: 'Deoghar, Jharkhand 814112' },
        { name: 'mapEmbedUrl', type: 'text', admin: { description: 'Google Maps embed URL.' } },
      ],
    },
    {
      name: 'whatsappDefaultMessage',
      type: 'textarea',
      defaultValue: 'Hi Kartikart! I would like to plan a trip. Please help me with a quote.',
    },
  ],
}
