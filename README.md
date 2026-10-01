# Cordova RP

Site da cidade. A loja cobra no Mercado Pago e, depois da confirmação, avisa o Discord e entrega no jogo.

## Variáveis

Copie `.env.example` para `.env.local` e preencha. Na Vercel, as mesmas chaves entram em Settings → Environment Variables.

`NEXT_PUBLIC_SITE_URL` é o endereço HTTPS da Vercel, por exemplo `https://cordova.vercel.app`. O Mercado Pago avisa `https://cordova.vercel.app/api/mercadopago`.

`GAME_DELIVER_SECRET` precisa ser igual ao `setr cordova_site_secret` do `server.cfg`.

No Discord, o redirect do OAuth é `https://SEU-DOMINIO/api/auth/discord/callback`.
