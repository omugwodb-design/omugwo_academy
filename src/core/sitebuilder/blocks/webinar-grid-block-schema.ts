import { PropSchema } from '../types';

export const webinarGridBlockSchema: PropSchema[] = [
  { name: 'badgeText', type: 'text', label: 'Badge Text', group: 'Content' },
  { name: 'title', type: 'text', label: 'Title', group: 'Content' },
  { name: 'subtitle', type: 'textarea', label: 'Subtitle', group: 'Content' },
  {
    name: 'columns',
    type: 'select',
    label: 'Columns',
    options: [{label: '2', value: '2'}, {label: '3', value: '3'}, {label: '4', value: '4'}],
    group: 'Layout'
  },
  { name: 'backgroundColor', type: 'color', label: 'Background Color', group: 'Style' },
  {
    name: 'paddingY',
    type: 'select',
    label: 'Padding Y',
    options: [{label: 'py-12', value: 'py-12'}, {label: 'py-16', value: 'py-16'}, {label: 'py-20', value: 'py-20'}, {label: 'py-24', value: 'py-24'}, {label: 'py-32', value: 'py-32'}],
    group: 'Layout'
  },
  {
    name: 'containerSize',
    type: 'select',
    label: 'Container Size',
    options: [{label: 'max-w-4xl', value: 'max-w-4xl'}, {label: 'max-w-5xl', value: 'max-w-5xl'}, {label: 'max-w-6xl', value: 'max-w-6xl'}, {label: 'max-w-7xl', value: 'max-w-7xl'}],
    group: 'Layout'
  },
  {
    name: 'webinars',
    type: 'array',
    label: 'Webinars',
    arrayItemSchema: [
      { name: 'title', type: 'text', label: 'Title' },
      { name: 'description', type: 'textarea', label: 'Description' },
      { name: 'image', type: 'image', label: 'Image' },
      { name: 'date', type: 'text', label: 'Date' },
      { name: 'time', type: 'text', label: 'Time' },
      { name: 'duration', type: 'text', label: 'Duration' },
      { name: 'price', type: 'text', label: 'Price' },
      { name: 'instructor', type: 'text', label: 'Instructor' },
      { name: 'spotsLeft', type: 'text', label: 'Spots Left' },
      {
        name: 'type',
        type: 'select',
        label: 'Type',
        options: [{label: 'live', value: 'live'}, {label: 'recorded', value: 'recorded'}]
      }
    ],
    group: 'Content'
  }
];

export const contactFormBlockSchema: PropSchema[] = [
  { name: 'title', type: 'text', label: 'Title', group: 'Content' },
  { name: 'subtitle', type: 'textarea', label: 'Subtitle', group: 'Content' },
  { name: 'backgroundColor', type: 'color', label: 'Background Color', group: 'Style' },
  {
    name: 'paddingY',
    type: 'select',
    label: 'Padding Y',
    options: [{label: 'py-12', value: 'py-12'}, {label: 'py-16', value: 'py-16'}, {label: 'py-20', value: 'py-20'}, {label: 'py-24', value: 'py-24'}, {label: 'py-32', value: 'py-32'}],
    group: 'Layout'
  },
  {
    name: 'containerSize',
    type: 'select',
    label: 'Container Size',
    options: [{label: 'max-w-4xl', value: 'max-w-4xl'}, {label: 'max-w-5xl', value: 'max-w-5xl'}, {label: 'max-w-6xl', value: 'max-w-6xl'}, {label: 'max-w-7xl', value: 'max-w-7xl'}],
    group: 'Layout'
  },
  {
    name: 'fields',
    type: 'array',
    label: 'Form Fields',
    arrayItemSchema: [
      { name: 'name', type: 'text', label: 'Field Name' },
      { name: 'label', type: 'text', label: 'Field Label' },
      {
        name: 'type',
        type: 'select',
        label: 'Field Type',
        options: [{label: 'text', value: 'text'}, {label: 'email', value: 'email'}, {label: 'tel', value: 'tel'}, {label: 'select', value: 'select'}, {label: 'textarea', value: 'textarea'}]
      }
    ],
    group: 'Content'
  }
];

export const contactInfoBlockSchema: PropSchema[] = [
  { name: 'title', type: 'text', label: 'Title', group: 'Content' },
  { name: 'subtitle', type: 'textarea', label: 'Subtitle', group: 'Content' },
  {
    name: 'columns',
    type: 'select',
    label: 'Columns',
    options: [{label: '2', value: '2'}, {label: '3', value: '3'}, {label: '4', value: '4'}],
    group: 'Layout'
  },
  { name: 'backgroundColor', type: 'color', label: 'Background Color', group: 'Style' },
  {
    name: 'paddingY',
    type: 'select',
    label: 'Padding Y',
    options: [{label: 'py-12', value: 'py-12'}, {label: 'py-16', value: 'py-16'}, {label: 'py-20', value: 'py-20'}, {label: 'py-24', value: 'py-24'}, {label: 'py-32', value: 'py-32'}],
    group: 'Layout'
  },
  {
    name: 'containerSize',
    type: 'select',
    label: 'Container Size',
    options: [{label: 'max-w-4xl', value: 'max-w-4xl'}, {label: 'max-w-5xl', value: 'max-w-5xl'}, {label: 'max-w-6xl', value: 'max-w-6xl'}, {label: 'max-w-7xl', value: 'max-w-7xl'}],
    group: 'Layout'
  },
  {
    name: 'contactMethods',
    type: 'array',
    label: 'Contact Methods',
    arrayItemSchema: [
      {
        name: 'icon',
        type: 'select',
        label: 'Icon',
        options: [{label: 'mail', value: 'mail'}, {label: 'phone', value: 'phone'}, {label: 'map-pin', value: 'map-pin'}, {label: 'external-link', value: 'external-link'}]
      },
      { name: 'title', type: 'text', label: 'Title' },
      { name: 'description', type: 'textarea', label: 'Description' },
      { name: 'contact', type: 'text', label: 'Contact Info' },
      { name: 'link', type: 'text', label: 'Link' }
    ],
    group: 'Content'
  }
];
