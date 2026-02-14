import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../src/lib/prisma'; // Usa o arquivo do Passo 1

// O segredo é adicionar "export" aqui na constante
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET || 'secret-temporaria-change-me',
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Busca usuário
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });

        // Verifica se usuário existe e tem senha (comparação simples por enquanto)
        // Nota: Em produção real, use bcrypt. Aqui vamos comparar direto para garantir que funcione o teste
        if (!user || user.password !== credentials.password) {
          return null;
        }

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