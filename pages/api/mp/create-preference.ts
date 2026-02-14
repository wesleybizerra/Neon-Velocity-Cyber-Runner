
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  const { itemId, userId } = req.body;
  const items = {
    'pack-starter': { name: 'Kit Iniciante', price: 5.00 },
    'pack-speedster': { name: 'Combo Velocista', price: 10.00 },
    'pack-elite': { name: 'Passe de Elite', price: 15.00 },
    'pack-vault': { name: 'Cofre Mega', price: 20.00 },
    'pack-legend': { name: 'Lenda Cyberpunk', price: 30.00 },
  };
  const selectedItem = (items as any)[itemId];
  if (!selectedItem) return res.status(404).json({ error: 'Item not found' });

  try {
    const preference = new Preference(client);
    const response = await preference.create({
      body: {
        items: [{ id: itemId, title: selectedItem.name, quantity: 1, unit_price: selectedItem.price, currency_id: 'BRL' }],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/sucesso`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/erro`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/pendente`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mp/webhook`,
        external_reference: userId,
      }
    });
    return res.status(200).json({ init_point: response.init_point });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
