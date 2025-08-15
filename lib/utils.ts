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
export async function formatError(error:any) {

  //handle zod errors
 if(error === "ZodError") {
    const errMsg = JSON.parse(error).map((error: any) => error.message).join(', ');
    console.log("error))))))))))))))))>", errMsg);
    return errMsg

  }else if(error.name === "PrismaClientKnownRequestError" && error.code === "P2002") {
    //handle prisma errors
    
  }else {
    //handle other errors
  }
}