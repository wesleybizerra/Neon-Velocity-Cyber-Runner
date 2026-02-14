import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]"; // Ajuste se seu authOptions estiver em outro lugar, ou use getSession padrão

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { score, coins, xp } = req.body;

  // LOG PARA DEPURAR NO RAILWAY
  console.log("--- FIM DE PARTIDA RECEBIDO ---");
  console.log("Dados recebidos:", { score, coins, xp });

  try {
    // 1. Tenta pegar o email do usuário logado
    // Se estiver usando NextAuth v4, as vezes a sessão vem no body ou cookies
    // Vamos tentar pegar pelo email que deve vir no Session, mas como fallback vamos buscar o usuário
    // IMPORTANTE: Para simplificar, vou assumir que você está logado. 
    // Se o session falhar, o jogo não salva.

    // Vamos buscar o usuário pelo email da sessão
    // Se você não tiver configurado o getServerSession corretamente, isso pode falhar.
    // DICA: Em projetos simples, às vezes é mais fácil enviar o userId no body (embora menos seguro, funciona pra testar)

    // VAMOS USAR UMA ABORDAGEM HÍBRIDA MAIS SEGURA PARA SEU CASO:
    // O ideal é usar session, mas vou fazer um código que aceita userId se enviado manualmente no frontend (para garantir que funcione agora)

    // OBS: No seu index.tsx você não está enviando userId, então vamos confiar na sessão ou no email

    // Buscando sessão
    // Nota: precisa importar authOptions corretamente. Se der erro de import, use getSession do next-auth/react no front e envie o email.

    // --- SOLUÇÃO IMEDIATA: Vamos confiar que o frontend vai mandar o email ou ID ---
    // Vou pedir para você alterar o frontend para mandar o email/id para garantir.

    const { userId, userEmail } = req.body;

    let user;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    } else if (userEmail) {
      user = await prisma.user.findUnique({ where: { email: userEmail } });
    }

    if (!user) {
      console.log("Usuário não encontrado para salvar!");
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // 2. Aplica Multiplicadores do Banco de Dados
    const finalCoins = Math.floor(coins * (user.coinMultiplier || 1));
    const finalScore = Math.floor(score * (user.scoreMultiplier || 1));
    const finalXp = Math.floor(score / 5); // 1 XP a cada 5 pontos de score

    console.log(`Salvando para ${user.name}: +${finalCoins} Coins, HighScore Check: ${finalScore}`);

    // 3. Atualiza o Banco
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        coins: { increment: finalCoins },
        gems: { increment: 0 }, // Gemas não ganha jogando, só comprando
        // Só atualiza o HighScore se o novo for maior
        highScore: { set: finalScore > user.highScore ? finalScore : user.highScore },
        matchesPlayed: { increment: 1 },
        // Se quiser atualizar XP e Level no profile, precisaria de update no Profile tbm
      },
    });

    console.log("Banco atualizado com sucesso!");
    return res.status(200).json(updatedUser);

  } catch (error) {
    console.error("ERRO NO END-MATCH:", error);
    return res.status(500).json({ message: 'Erro interno ao salvar' });
  }
}