export type PostLink = { label: string; href: string };

export type FeedPost = {
  id: string;
  title: string;
  image: string;
  body: string;
  links: PostLink[];
  authorId: string | null;
  authorName: string;
  createdAt: string;
  source: "config" | "db";
};

export const defaultPosts: FeedPost[] = [
  {
    id: "conectar",
    title: "Como entrar na cidade",
    image: "",
    body: "Entre por cfx.re/join/dq877j. Se o navegador não abrir o FiveM, aperte F8 e digite connect dq877j. A whitelist é feita no Discord da cidade.",
    links: [{ label: "Entrar na cidade", href: "https://cfx.re/join/dq877j" }],
    authorId: null,
    authorName: "Cordova RP",
    createdAt: "2026-09-30T12:00:00.000Z",
    source: "config"
  },
  {
    id: "vip-wipe",
    title: "VIP Wipe na loja",
    image: "",
    body: "O VIP Wipe custa R$ 189,99. Carro, moto e mochila ficam até o wipe. Salário, Spotify e parkour duram 30 dias. O R$ 1.000.000 entra no extrato como VIP Wipe depois que o Mercado Pago confirma.",
    links: [],
    authorId: null,
    authorName: "Cordova RP",
    createdAt: "2026-09-30T11:00:00.000Z",
    source: "config"
  },
  {
    id: "discord",
    title: "Avisos e suporte",
    image: "",
    body: "Regras, whitelist e chamados ficam no Discord. Dentro do jogo, o suporte também abre pelo F5.",
    links: [{ label: "Discord", href: "https://discord.com/invite/HVPkjSCcWZ" }],
    authorId: null,
    authorName: "Cordova RP",
    createdAt: "2026-09-30T10:00:00.000Z",
    source: "config"
  }
];
