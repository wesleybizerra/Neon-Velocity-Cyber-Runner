import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

// REMOVI AS IMPORTAÇÕES DE AUTH QUE ESTAVAM DANDO ERRO
// Agora vamos usar o ID que vem direto do Frontend

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  // Recebe score, coins e OBRIGATORIAMENTE o userId ou userEmail
  const { score, coins, userId, userEmail } = req.body;

  console.log("--- TENTATIVA DE SALVAR PARTIDA ---");
  console.log("Dados:", { score, coins, userId });

  try {
    let user;

    // 1. Tenta achar o usuário pelo ID (Prioridade)
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    }
    // 2. Se não tiver ID, tenta pelo Email
    else if (userEmail) {
      user = await prisma.user.findUnique({ where: { email: userEmail } });
    }

    // Se não achou ninguém, cancela
    if (!user) {
      console.log("ERRO: Usuário não identificado.");
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // 3. Calcula os valores finais (usando multiplicadores se tiver)
    // Se o multiplicador for null/undefined, usa 1
    const coinMult = user.coinMultiplier || 1;
    const scoreMult = user.scoreMultiplier || 1;

    const finalCoins = Math.floor(coins * coinMult);
    const finalScore = Math.floor(score * scoreMult);

    console.log(`Usuário: ${user.name} | Ganhos Finais: ${finalCoins} Moedas (Mult: ${coinMult}x)`);

    // 4. Salva no Banco de Dados
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        coins: { increment: finalCoins },
        // Atualiza o HighScore apenas se o novo for maior
        highScore: { set: finalScore > (user.highScore || 0) ? finalScore : user.highScore },
        matchesPlayed: { increment: 1 },
      },
    });

    console.log("SUCESSO: Banco atualizado.");
    return res.status(200).json(updatedUser);

  } catch (error) {
    console.error("ERRO CRÍTICO AO SALVAR:", error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
}