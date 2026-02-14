
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  const { action, data } = req.body;
  if (action === 'payment.created' || action === 'payment.updated') {
    try {
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: data.id });
      if (paymentData.status === 'approved') {
        const userId = paymentData.external_reference;
        const itemId = paymentData.additional_info?.items?.[0]?.id;
        const existing = await prisma.purchase.findUnique({ where: { mpPaymentId: String(data.id) } });
        if (existing) return res.status(200).send('OK');

        let coinBonus = 0;
        if (itemId === 'pack-starter') coinBonus = 500;
        if (itemId === 'pack-speedster') coinBonus = 1500;
        // ... outras lógicas

        await prisma.$transaction([
          prisma.purchase.create({
            data: { userId: userId!, itemId: itemId!, mpPaymentId: String(data.id), status: 'approved', amount: paymentData.transaction_amount! }
          }),
          prisma.profile.update({
            where: { userId: userId! },
            data: { coins: { increment: coinBonus }, benefits: { push: itemId! } }
          })
        ]);
      }
    } catch (e) { console.error(e); }
  }
  res.status(200).send('OK');
}
