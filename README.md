# Site TLNutrition — tln.pt

Este repositório tem **só o que está publicado** em tln.pt: HTML, CSS, imagens
e vídeos, já prontos. Não há nada para compilar nem para instalar.

As alterações não se fazem aqui à mão. O site é gerado no computador do
Marinho e enviado para este repositório; cada envio deve ir para o ar sozinho.

## Ligar ao alojamento (uma vez)

Ligar este repositório ao alojamento de tln.pt, com publicação automática a
cada envio para o ramo `main`:

- **Pasta a publicar:** a raiz do repositório
- **Comando de compilação:** nenhum
- **Domínio:** tln.pt (e www.tln.pt a reencaminhar para tln.pt)

Na Vercel, Netlify ou Cloudflare Pages isto faz-se no painel, ligando o
repositório. Num alojamento tradicional (cPanel/FTP), é preciso um passo
automático no GitHub (GitHub Actions) que copie os ficheiros por FTP/SFTP a
cada envio — avisem o Marinho de qual é o alojamento, e esse passo é
preparado do lado de cá.

## O formulário de contactos

A página `contactos.html` envia a mensagem por POST para `/api/contacto`, em
JSON. O ficheiro `api/contacto.js` é uma função da **Vercel** (Node).

Na Vercel, pôr em Settings → Environment Variables:

| Variável | Valor |
|---|---|
| `RESEND_API_KEY` | a chave do Resend (pedir ao Marinho; nunca vai para o código) |
| `CONTACTO_PARA` | opcional; por omissão `geral@tln.pt` |
| `CONTACTO_DE` | opcional; por omissão `site@tlnutrition.pt` (tem de ser de um domínio verificado no Resend) |

Noutro alojamento a função não corre tal como está: digam ao Marinho qual é,
para ser adaptada antes. Até lá, se o envio falhar, o formulário abre o
programa de email de quem escreve, já preenchido para geral@tln.pt.

## Cuidados

- No domínio **tlnutrition.pt** há registos DNS do Resend (`send`, `rsend`,
  `resend._domainkey`, `_dmarc`) que servem outros emails. **Não mexer.**
- **kids.tlnutrition.pt** é outro site, já no ar na Vercel. Não faz parte deste.
- Os vídeos (`.mp4`) precisam de respostas por intervalo (HTTP 206), o que todos
  os alojamentos acima fazem por omissão.
- O site não usa cookies: guarda só, na sessão do navegador, um registo de que
  a animação de entrada já foi mostrada (`tln-abertura`). Se forem acrescentadas
  estatísticas (Google Analytics, Pixel da Meta…), passa a precisar de aviso e
  de consentimento.
