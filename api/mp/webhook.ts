
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });

// Use any for req and res to avoid missing type exports from 'next' in this environment
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

        // Evitar duplicidade
        const existing = await prisma.purchase.findUnique({ where: { mpPaymentId: String(data.id) } });
        if (existing) return res.status(200).send('OK');

        // Conceder benefícios baseado no itemId
        let coinBonus = 0;
        if (itemId === 'pack-starter') coinBonus = 500;
        if (itemId === 'pack-speedster') coinBonus = 1500;
        // ... adicione as outras lógicas aqui

        await prisma.$transaction([
          prisma.purchase.create({
            data: {
              userId: userId!,
              itemId: itemId!,
              mpPaymentId: String(data.id),
              status: 'approved',
              amount: paymentData.transaction_amount!
            }
          }),
          prisma.profile.update({
            where: { userId: userId! },
            data: {
              coins: { increment: coinBonus },
              benefits: { push: itemId! }
            }
          })
        ]);
      }
    } catch (e) {
      console.error("Webhook Error:", e);
    }
  }

  res.status(200).send('OK');
}
