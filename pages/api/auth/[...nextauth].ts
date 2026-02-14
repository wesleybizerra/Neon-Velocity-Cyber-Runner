import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../src/lib/prisma';
import bcrypt from 'bcryptjs'; // Importante para comparar

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET || 'segredo-temporario',
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Digite email e senha');
        }

        // 1. Busca o usuário pelo email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        // 2. Verifica se usuário existe e tem senha salva
        if (!user || !user.password) {
          throw new Error('Usuário não encontrado');
        }

        // 3. COMPARA A SENHA DIGITADA COM O HASH DO BANCO
        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Senha incorreta');
        }

        // Se chegou aqui, logou!
        return { id: user.id, email: user.email, name: user.name };
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        // @ts-ignore
        session.user.id = token.sub;
      }
      return session;
    }
  }
};

export default NextAuth(authOptions);