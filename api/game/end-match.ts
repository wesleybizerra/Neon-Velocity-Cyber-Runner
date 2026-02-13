
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Use any for req and res to avoid missing type exports from 'next' in this environment
export default async function handler(req: any, res: any) {
  const session = await getSession({ req });
  if (!session?.user) return res.status(401).json({ error: "Unauthorized" });

  const { score, coins, xp } = req.body;

  // Anti-cheat básico: score não pode ser absurdamente alto para o tempo
  if (score > 100000) return res.status(400).json({ error: "Invalid score" });

  try {
    const updatedProfile = await prisma.profile.update({
      where: { userId: (session.user as any).id },
      data: {
        coins: { increment: coins },
        xp: { increment: xp },
        level: { set: Math.floor((xp / 1000) + 1) }
      }
    });

    return res.status(200).json(updatedProfile);
  } catch (e) {
    return res.status(500).json({ error: "Failed to update profile" });
  }
}
