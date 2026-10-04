import { type ActionParams, type ShopAction } from "./actions";

const IMG = "/imagens";

export type ShopCategory = "vips" | "others" | "crp" | "vehicles" | "mansions" | "weapons";

export type Product = {
  id: string;
  name: string;
  category: ShopCategory;
  price: number | null;
  crpPrice: number | null;
  image: string;
  description: string;
  benefits: string[];
  purchaseType?: string;
  amount?: number;
  action?: ShopAction;
  actionParams?: ActionParams;
  sellOnline: boolean;
  source: "config" | "db";
};

export const categoryLabels: Record<ShopCategory, string> = {
  vips: "VIPs",
  crp: "CRP",
  others: "Outros",
  vehicles: "Veículos",
  mansions: "Mansões",
  weapons: "Armas"
};

type Draft = {
  id: string;
  name: string;
  category: ShopCategory;
  price?: number | null;
  crpPrice?: number | null;
  image: string;
  description: string;
  benefits?: string[];
  purchaseType?: string;
  amount?: number;
};

function draft(item: Draft): Product {
  const price = item.price ?? null;
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    price,
    crpPrice: item.crpPrice ?? null,
    image: item.image.startsWith("http") ? item.image : `${IMG}/${item.image}`,
    description: item.description,
    benefits: item.benefits || [],
    purchaseType: item.purchaseType,
    amount: item.amount,
    sellOnline: typeof price === "number" && price > 0,
    source: "config"
  };
}

const vipPlans: Product[] = [
  ["Bronze", "VIP Bronze", 24.99, "vip_bronze.png", "Bronze", 6, 200, 50000, ["30 dias", "Salário de R$ 200 por hora", "Garagem com 6 vagas", "/attachs e /cor", "Bônus de $50.000 no banco"]],
  ["Prata", "VIP Prata", 49.99, "vip_prata.png", "Prata", 8, 400, 80000, ["30 dias", "Salário de R$ 400 por hora", "Garagem com 8 vagas", "/attachs e /cor", "Bônus de $80.000 no banco"]],
  ["Ouro", "VIP Ouro", 89.99, "vip_ouro.png", "Ouro", 10, 600, 100000, ["30 dias", "Salário de R$ 600 por hora", "Garagem com 10 vagas", "Troca de roupa sem o item", "Bônus de $100.000 no banco"]],
  ["Platina", "VIP Platina", 149.99, "vip_platina.png", "Platina", 12, 800, 150000, ["30 dias", "Salário de R$ 800 por hora", "Garagem com 12 vagas", "Troca de roupa sem o item", "Tamanho da mochila mantido ao morrer", "Bônus de $150.000 no banco"]],
  ["Diamante", "VIP Diamante", 249.99, "vip_diamante.png", "Diamante", 20, 1000, 500000, ["30 dias", "Salário de R$ 1.000 por hora", "Garagem com 20 vagas", "/attachs e /cor", "Troca de roupa sem o item", "Tamanho da mochila mantido ao morrer", "Bônus de $500.000 no banco"]],
  ["Esmeralda", "VIP Esmeralda", 349.99, "vip_esmeralda.png", "Esmeralda", 15, 1200, 200000, ["30 dias", "Salário de R$ 1.200 por hora", "Garagem com 15 vagas", "/som dentro do veículo", "/attachs e /cor", "Troca de roupa sem o item", "Tamanho da mochila mantido ao morrer", "Bônus de $200.000 no banco"]],
  ["Patrocinador", "VIP Patrocinador", 499.99, "vip_patrocinador.png", "Patrocinador", 25, 2000, 750000, ["30 dias", "Salário de R$ 2.000 por hora", "Garagem com 25 vagas", "/som dentro do veículo", "/attachs e /cor", "/reparar", "Troca de roupa sem o item", "Tamanho da mochila mantido ao morrer", "Bônus de $750.000 no banco"]]
].map(([id, name, price, image, group, slots, salary, bank, benefits]) => draft({
  id: String(id),
  name: String(name),
  category: "vips",
  price: Number(price),
  image: String(image),
  description: `${name} por 30 dias. Entra o grupo ${group}, salário de R$ ${Number(salary).toLocaleString("pt-BR")} por hora, garagem com ${slots} vagas e $${Number(bank).toLocaleString("pt-BR")} no banco na confirmação.`,
  benefits: benefits as string[],
  purchaseType: "monthly"
}));

const mansions: Array<[string, string, number, string, string]> = [
  ["mansao1", "Mansão Fazenda", 3500, "mansao_fazenda.png", "MansaoFazenda"],
  ["mansao3", "Mansão Olhar", 1500, "mansao_olhar.png", "MansaoOlhar"],
  ["mansao4", "Mansão Lago", 3000, "mansao_lago.png", "MansaoLago"],
  ["mansao5", "Mansão Francesa", 3500, "mansao_francesa.png", "MansaoFrancesa"],
  ["mansao7", "Mansão Riqueza", 3500, "mansao_riqueza.png", "MansaoRiqueza"],
  ["mansao8", "Mansão Vista", 1800, "mansao_vista.png", "MansaoVista"],
  ["mansao10", "Mansão Eclipse", 1500, "mansao_eclipse.png", "MansaoEclipse"],
  ["mansao11", "Mansão Jardim", 3000, "mansao_jardim.png", "MansaoJardim"],
  ["mansao12", "Mansão Bilhar", 2300, "mansao_bilhar.png", "MansaoBilhar"],
  ["mansao13", "Mansão Malibu", 3500, "mansao_malibu.png", "MansaoMalibu"],
  ["mansao14", "Mansão Zancudo", 2500, "mansao_zancudo.png", "MansaoZancudo"],
  ["mansao15", "Mansão Praiana", 1500, "mansao_praiana.png", "MansaoPraiana"],
  ["mansao16", "Mansão Vineward", 2500, "mansao_vineward.png", "MansaoVineward"],
  ["mansao17", "Mansão Cristal", 2500, "mansao_cristal.png", "MansaoCristal"]
];

export const defaultProducts: Product[] = [
  ...vipPlans,
  draft({
    id: "Wipe",
    name: "VIP Wipe",
    category: "vips",
    price: 189.99,
    image: "vip_wipe.png",
    purchaseType: "permanent",
    description: "Skyline R34, uma moto e mochila até o wipe. Salário, Spotify e parkour por 30 dias.",
    benefits: [
      "Skyline R34 e 1 moto até o wipe",
      "Mochila, garagem de 12 vagas e /fixvip até o wipe",
      "Salário de R$ 600 por hora, Spotify e parkour por 30 dias",
      "R$ 1.000.000 no extrato VIP Wipe"
    ]
  }),
  draft({ id: "crp_100", name: "100 CRP", category: "crp", price: 24.99, amount: 100, image: "promocao_especial.png", description: "Pacote inicial de Cordova Real Points. Pague com PIX ou cartão e o saldo cai na conta.", benefits: ["100 CRP na conta do passaporte"] }),
  draft({ id: "crp_500", name: "500 CRP", category: "crp", price: 59.99, amount: 500, image: "promocao_especial.png", description: "Pacote intermediário de Cordova Real Points. Pague com PIX ou cartão e o saldo cai na conta.", benefits: ["500 CRP na conta do passaporte"] }),
  draft({ id: "crp_1000", name: "1000 CRP", category: "crp", price: 99.99, amount: 1000, image: "promocao_especial.png", description: "Pacote maior de Cordova Real Points. Pague com PIX ou cartão e o saldo cai na conta.", benefits: ["1000 CRP na conta do passaporte"] }),
  draft({ id: "crp_10000", name: "10000 CRP", category: "crp", price: 849.9, amount: 10000, image: "promocao_especial.png", description: "Pacote de 10.000 CRP. Dez pacotes de 1.000 sairiam R$ 899,00; aqui fica R$ 849,90.", benefits: ["10000 CRP na conta do passaporte"] }),
  draft({
    id: "Parkour",
    name: "Mobilidade Parkour",
    category: "others",
    price: 49.99,
    crpPrice: 350,
    image: "parkour.png",
    purchaseType: "monthly",
    description: "Deslizada, salto e cambalhota por 30 dias. Com o parkour ativo, as manobras ficam liberadas sem comando.",
    benefits: ["Parkour ativo por 30 dias", "Grupo Parkour", "Sem comando para usar as manobras"]
  }),
  draft({
    id: "Spotify",
    name: "Spotify Premium",
    category: "others",
    price: 29.99,
    crpPrice: 100,
    image: "spotify.jpg",
    purchaseType: "monthly",
    description: "Som no veículo por 30 dias. Use /som dentro do carro.",
    benefits: ["Acesso ao /som por 30 dias", "Grupo Spotify"]
  }),
  draft({
    id: "Cinema",
    name: "Ingresso Cinema",
    category: "others",
    crpPrice: 100,
    image: "cinema.png",
    description: "Grupo tv por 30 dias. Com o cinema privado, só quem tem o ingresso troca o vídeo, a pausa, a fila e o volume.",
    benefits: ["Grupo tv por 30 dias", "Permissão cinema.permissao"]
  }),
  draft({
    id: "ResetChar",
    name: "Reset de Personagem",
    category: "others",
    price: 49.99,
    crpPrice: 500,
    image: "https://svgsilh.com/svg/160895.svg",
    description: "Um crédito de /resetchar. Refaz rosto, cabelo e corpo. Nome, dinheiro, inventário e veículos continuam.",
    benefits: ["1 uso de /resetchar", "Pode cancelar antes de confirmar", "Fica guardado até ser usado"]
  }),
  draft({
    id: "weapon_golden_deagle",
    name: "Desert Eagle Dourada",
    category: "weapons",
    crpPrice: 800,
    image: "golden_deagle.png",
    description: "Desert Eagle dourada com 250 munições, entregue no inventário.",
    benefits: ["Arma no inventário", "250 munições", "800 CRP na cidade"]
  }),
  ...mansions.map(([id, name, crp, image, group]) => draft({
    id,
    name,
    category: "mansions",
    crpPrice: crp,
    image,
    description: `${name} por 30 dias. O grupo ${group} entra na confirmação da compra na cidade.`,
    benefits: [`${crp} CRP`, "Aluguel de 30 dias", `Grupo ${group}`]
  }))
];

export function formatBrl(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatCrp(value: number) {
  return `${value.toLocaleString("pt-BR")} CRP`;
}
