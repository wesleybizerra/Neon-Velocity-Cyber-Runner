
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
    const session = await getSession({ req });
    if (!session?.user) return res.status(401).json({ error: "Unauthorized" });

    try {
        const profile = await prisma.profile.findUnique({ where: { userId: (session.user as any).id } });
        if (!profile) {
            const newProfile = await prisma.profile.create({
                data: {
                    userId: (session.user as any).id,
                    referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`
                }
            });
            return res.status(200).json({ ...session.user, ...newProfile });
        }
        return res.status(200).json({ ...session.user, ...profile });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
