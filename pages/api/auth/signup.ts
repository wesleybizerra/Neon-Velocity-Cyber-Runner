import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../src/lib/prisma';
import bcrypt from 'bcryptjs'; // Importante

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Apenas POST permitido' });
    }

    const { name, email, password } = req.body;

    if (!email || !password || password.length < 6) {
        return res.status(400).json({ message: 'Dados inválidos ou senha curta' });
    }

    try {
        // 1. Verifica se já existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(409).json({ message: 'Este e-mail já está cadastrado' });
        }

        // 2. CRIPTOGRAFA A SENHA (Isso gera aquele texto aleatório seguro)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Cria o usuário com a senha segura
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword, // Salva o hash, não a senha pura
                coins: 100, // Bônus inicial
            },
        });

        return res.status(201).json({ message: 'Usuário criado com sucesso', userId: user.id });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro interno ao criar conta' });
    }
}