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

//form fiels errors handler

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function formatError(error: any) {
  //handle zod errors
  if (error === 'ZodError') {
    const errMsg = JSON.parse(error)
      .map((error: any) => error.message)
      .join(', ');

    return errMsg;
  } else if (
    error.name === 'PrismaClientKnownRequestError' &&
    error.code === 'P2002'
  ) {
    //handle prisma errors
  } else {
    //handle other errors
  }
}

//round number to two decimal places
export function roundToTwo(value: number | string) {
  if (typeof value === 'number') {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === 'string') {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error('value must be a number or string');
  }
}

//convert into any international currency format
const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2,
});

//format currency using the formatter above
export function formatCurrency(amount: number | string | null) {
  if (typeof amount === 'number') {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === 'string') {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return 'NaN';
  }
}
