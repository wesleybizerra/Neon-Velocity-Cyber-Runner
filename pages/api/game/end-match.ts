import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../src/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { score, coins, userId } = req.body;

  console.log(`[GAME] Salvando partida... UserID: ${userId}, Score: ${score}, Coins: ${coins}`);

  if (!userId) {
    return res.status(400).json({ message: "ID do usuário obrigatório" });
  }

  try {
    // 1. Busca usuário para pegar multiplicadores
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) return res.status(404).json({ message: 'User not found' });

    // 2. Calcula final
    const finalCoins = Math.floor(coins * (user.coinMultiplier || 1));
    const finalScore = Math.floor(score * (user.scoreMultiplier || 1));

    // 3. Atualiza
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        coins: { increment: finalCoins },
        highScore: { set: finalScore > user.highScore ? finalScore : user.highScore },
        matchesPlayed: { increment: 1 },
      },
    });

    console.log(`[GAME] Salvo! Novo saldo: ${updatedUser.coins}`);
    return res.status(200).json(updatedUser);

  } catch (error) {
    console.error("[GAME] Erro:", error);
    return res.status(500).json({ message: 'Erro interno' });
  }
}