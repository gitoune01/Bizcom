import { z } from 'zod';
import { formatNumberWithDecimal } from './utils';
import { Currency } from 'lucide-react';

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    { message: 'Please enter a valid price with two decimal places' }
  );

//schema for inserting products
export const insertProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  slug: z.string().min(3, 'Slug must be at least 3 characters long'),
  category: z.string().min(3, 'Category must be at least 3 characters long'),
  description: z
    .string()
    .min(3, 'Description must be at least 3 characters long'),
  stock: z.number(),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  brand: z
    .string()
    .min(3, 'Brand must be at least 3 characters long')
    .min(1, 'Brand must be at least 1 characters long'),

  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});
