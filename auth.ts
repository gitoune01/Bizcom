import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/db/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';
import { compareSync } from 'bcrypt-ts-edge';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { tr } from 'zod/v4/locales';

//config file for next auth js

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: 'email',
        },
        password: {
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // Return null if user data is not found or password does not match
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      //set user ID from token
      session.user.id = token.sub; //sub is the user ID

      //set the user role
      session.user.role = token.role;

      //set the user name
      session.user.name = token.name;

      //if there is an update,set the user name
      if (trigger === 'update') {
        session.user.name = user.name as string;
      }

      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.role = user.role;
        //id user has no name
        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0];
        }

        //update database to reflect  the token nam
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            name: token.name,
          },
        });
      }
      return token;
    },
    authorized({ request, auth }: any) {
      // check for session cart cookie
      if (!request.cookies.get('sessionCartId')) {
        //Generate a new session cart ID cookie
        const sessionCartId = crypto.randomUUID();

        //clone the request  headers
        const newReqHeaders = new Headers(request.headers);

        //create new response and the new cookie to it
        const response = NextResponse.next({
          request: {
            headers: newReqHeaders,
          },
        });
        //set new cookie to the response
        response.cookies.set('sessionCartId', sessionCartId);
        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
