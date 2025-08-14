import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/db/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import  type { NextAuthConfig} from 'next-auth';
import { compareSync } from 'bcrypt-ts-edge';


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
    // async jwt({ token, user }) {
    //   if (user) {
    //     token.id = user.id;
    //     token.name = user.name;
    //     token.email = user.email;
    //     token.role = user.role;
    //   }
    //   return token;
    // },
    async session({ session, user, trigger, token }: any) {
      //set user ID from token
      session.user.id = token.sub; //sub is the user ID

      //if there is an update,set the user name
      if (trigger === 'update') {
        session.user.name = user.name as string;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
