import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = await getSession({ req });
  if (!session || !session.user?.email) {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  const { score, coins } = req.body;

  try {
    // Busca o usuário atual
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    // Aplica multiplicadores (se o usuário tiver upgrades)
    // Se não tiver colunas de multiplier ainda, usa 1 como padrão
    const finalCoins = Math.floor(coins * (user.coinMultiplier || 1));
    const finalScore = Math.floor(score * (user.scoreMultiplier || 1));

    // Atualiza o banco
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        coins: { increment: finalCoins },
        // Só atualiza o highscore se o novo for maior
        highScore: { set: finalScore > (user.highScore || 0) ? finalScore : user.highScore },
        matchesPlayed: { increment: 1 },
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao salvar partida' });
  }
}