import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//convert prisma object to js object

export function convertToJsObject<T>(value: T): T {
  0;
 
  return JSON.parse(JSON.stringify(value));
}

//format number with decimal  places
export function formatNumberWithDecimal(num: number): string {
  const [intPart, decimalPart] = num.toString().split('.');
  return decimalPart
    ? `${intPart}.${decimalPart.padEnd(2, '0')}`
    : `${intPart}.00`;
}
