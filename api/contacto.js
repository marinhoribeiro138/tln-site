// O envio do formulário de contactos (contactos.html → POST /api/contacto).
//
// Corre na Vercel, como função do projeto do site: recebe a mensagem em JSON
// e envia-a para o email do TLN através do Resend (a mesma conta que já envia
// os emails do domínio tlnutrition.pt). Quem escreveu fica como «Responder
// a», para se responder diretamente do email.
//
// Precisa de uma variável no projeto da Vercel (Settings → Environment
// Variables), posta pelo Marinho — a chave nunca entra no código:
//   RESEND_API_KEY   a chave do Resend
// E, opcionais:
//   CONTACTO_PARA    para onde vai (por omissão geral@tln.pt)
//   CONTACTO_DE      quem envia (por omissão site@tlnutrition.pt; tem de ser
//                    de um domínio verificado no Resend)
//
// Se alguma coisa falhar, responde com erro e a página cai sozinha no modo
// antigo: abre a aplicação de email de quem escreve. Nenhuma mensagem se perde
// em silêncio.

const PARA = process.env.CONTACTO_PARA || 'geral@tln.pt';
const DE = process.env.CONTACTO_DE || 'Site TLNutrition <site@tlnutrition.pt>';
const QUEM = ['Atleta', 'Pai ou mãe', 'Clube', 'Outro'];

const limpo = (v, max) => String(v == null ? '' : v).replace(/[\r\n]+/g, ' ').trim().slice(0, max);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ erro: 'só POST' }); }
  if (!process.env.RESEND_API_KEY) return res.status(503).json({ erro: 'envio por configurar' });

  let d = req.body;
  if (typeof d === 'string') { try { d = JSON.parse(d); } catch (e) { d = null; } }
  if (!d || typeof d !== 'object') return res.status(400).json({ erro: 'pedido inválido' });

  // O campo «site» está escondido: uma pessoa nunca o preenche, um robô sim.
  // Finge-se que correu bem, para o robô não tentar outra vez.
  if (d.site) return res.status(200).json({ ok: true });

  const nome = limpo(d.nome, 120);
  const email = limpo(d.email, 160);
  const telemovel = limpo(d.telemovel, 40);
  const clube = limpo(d.clube, 120);
  const sou = QUEM.includes(d.sou) ? d.sou : 'Outro';
  const mensagem = String(d.mensagem == null ? '' : d.mensagem).trim().slice(0, 5000);
  if (!nome || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || mensagem.length < 5) {
    return res.status(400).json({ erro: 'faltam dados' });
  }

  const texto = [
    mensagem, '', '—',
    `${nome} (${sou})`, email,
    telemovel ? `Telemóvel: ${telemovel}` : null,
    clube ? `Clube: ${clube}` : null,
    '', 'Enviado pelo formulário de contactos do site.',
  ].filter((l) => l !== null).join('\n');

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: DE, to: [PARA], reply_to: email, subject: `Contacto pelo site: ${sou} · ${nome}`, text: texto }),
    });
    if (!r.ok) { console.error('Resend', r.status, await r.text()); return res.status(502).json({ erro: 'o envio falhou' }); }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ erro: 'o envio falhou' });
  }
};
