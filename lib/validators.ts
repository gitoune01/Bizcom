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

//schema for user sign in
export const signInFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

//schema for user sign up
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters long'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

//Cart schema
export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Product slug is required'),
  qty: z.number().int().nonnegative('Qty must be a non-negative integer'),
  image: z.string().min(1, 'Product images are required'),
  price: currency,
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, 'Session cart ID is required'),
  userId: z.string().optional().nullable(), //if user logged out, at login, he will find back his cart
});

//schema for shipping address

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3,'Full name must be at least 3 characters long'),
  streetAddress: z.string().min(3,'Street address must be at least 3 characters long'),
  city: z.string().min(3,'City must be at least 3 characters long'),
  postalCode: z.string().min(3,'Postal code must be at least 3 characters long'),
  country: z.string().min(3,'Country must be at least 3 characters long'),
  lat: z.number().optional(),
  lng: z.number().optional(),
 
});
