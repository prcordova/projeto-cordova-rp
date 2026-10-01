export type NewsItem = {
  id: string;
  title: string;
  date: string;
  body: string;
};

export const news: NewsItem[] = [
  {
    id: "conectar",
    title: "Como entrar na cidade",
    date: "30/09/2026",
    body: "No FiveM, aperte F8 e digite connect 45.146.81.194. A whitelist é feita no Discord da cidade."
  },
  {
    id: "vip-wipe",
    title: "VIP Wipe na loja",
    date: "30/09/2026",
    body: "O VIP Wipe custa R$ 189,99. Carro, moto e mochila ficam até o wipe. Salário, Spotify e parkour duram 30 dias. O R$ 1.000.000 entra no extrato como VIP Wipe depois que o Mercado Pago confirma."
  },
  {
    id: "discord",
    title: "Avisos e suporte",
    date: "30/09/2026",
    body: "Regras, whitelist e chamados ficam no Discord. Dentro do jogo, o suporte também abre pelo F5."
  }
];
