import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]'; // Agora vai funcionar
import { prisma } from '../../../src/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 1. Verifica quem está logado
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user?.email) {
        return res.status(401).json({ message: 'Não autenticado' });
    }

    try {
        // 2. Busca os dados ATUALIZADOS no banco
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                profile: true, // Inclui perfil se tiver
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // 3. Retorna os dados para o Frontend
        return res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.image,
            coins: user.coins, // O saldo atualizado vem daqui
            gems: user.gems,
            highScore: user.highScore,
            level: 1, // Lógica simples de nível
            streak: user.matchesPlayed
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar perfil' });
    }
}