
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') return res.status(405).end();
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        await prisma.user.create({
            data: {
                name, email, password: hashedPassword,
                profile: { create: { referralCode } }
            }
        });
        return res.status(201).json({ message: "User created" });
    } catch (error) {
        return res.status(400).json({ error: "User already exists" });
    }
}
