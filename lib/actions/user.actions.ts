'use server';

import { signInFormSchema, signUpFormSchema } from '../validators';
import { signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { hashSync } from 'bcrypt-ts-edge';
import { prisma } from '@/db/prisma';
import { CloudRain } from 'lucide-react';
import { formatError } from '../utils';
import { ZodError } from 'zod';

//sign In the user with credentials

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });
    await signIn('credentials', user);
    return { success: true, message: 'Signed in successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: 'Sign in failed' };
  }
}

//sign out the user
export async function signOutUser() {
  await signOut();
}

//sign up the user

///////////////////////////////////////////////////
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema?.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });
    const plainPassword = user.password;
    user.password = hashSync(user.password, 10);
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn('credentials', { email: user.email, password: plainPassword });
    return { success: true, message: 'Signed up successfully' };
  } catch (error: any) {
    console.log('error', error);
    let errMsg: string | undefined;
    if (error instanceof ZodError) {
      errMsg = error.issues.map((issue) => issue.message).join(', ');
      console.log("ERROR))))))))))))))))>", error.issues);
    } else if (
      error.name === 'PrismaClientKnownRequestError' &&
      error.code === 'P2002'
    ) {
      //handle prisma errors
      
      const field = error.meta?.target ? error.meta.target[0] : 'field';

      errMsg = field.charAt(0).toUpperCase() + field.slice(1);
      errMsg += ' already exists';
    } else {
      //handle other errors
      errMsg = typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
    }  

    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: errMsg };
  }
}
