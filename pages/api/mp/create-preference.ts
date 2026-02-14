import { NextApiRequest, NextApiResponse } from 'next';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configuração com SUA ACCESS TOKEN
const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-5486188186277562-123109-0c5bb1142056dd529240d38a493ce08d-650681524'
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { title, price, quantity, userId } = req.body;

  try {
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            // --- A CORREÇÃO ESTÁ AQUI EMBAIXO ---
            id: 'item-compra-loja', // O Mercado Pago EXIGE um ID, mesmo que genérico
            title: title,
            quantity: 1,
            unit_price: Number(price),
            currency_id: 'BRL',
          },
        ],
        // Aqui enviamos o ID do usuário para saber quem pagou depois
        external_reference: userId,
        back_urls: {
          success: 'https://neon-velocity-cyber-runner-production.up.railway.app/',
          failure: 'https://neon-velocity-cyber-runner-production.up.railway.app/',
          pending: 'https://neon-velocity-cyber-runner-production.up.railway.app/',
        },
        auto_return: 'approved',
      }
    });

    // Retorna o link de pagamento (init_point)
    res.status(200).json({ init_point: result.init_point });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar preferência MP' });
  }
}