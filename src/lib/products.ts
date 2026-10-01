export type Product = {
  id: string;
  name: string;
  category: "vips" | "others" | "crp";
  price: number;
  image: string;
  description: string;
  purchaseType?: string;
  amount?: number;
  benefits: string[];
};

export const products: Product[] = [
  {
    id: "Wipe",
    name: "VIP Wipe",
    category: "vips",
    price: 189.99,
    image: "/imagens/vip_wipe.png",
    purchaseType: "permanent",
    description: "Skyline R34, uma moto e mochila até o wipe. Salário, Spotify e parkour por 30 dias.",
    benefits: [
      "Skyline R34 e 1 moto até o wipe",
      "Mochila, garagem e /fixvip até o wipe",
      "Salário, Spotify e parkour por 30 dias",
      "R$ 1.000.000 no extrato VIP Wipe"
    ]
  },
  {
    id: "Parkour",
    name: "Mobilidade Parkour",
    category: "others",
    price: 49.99,
    image: "/imagens/loja.png",
    description: "Deslizada, salto e cambalhota por 30 dias.",
    benefits: ["Parkour ativo por 30 dias", "Sem comando para usar as manobras"]
  },
  {
    id: "Spotify",
    name: "Spotify Premium",
    category: "others",
    price: 29.99,
    image: "/imagens/loja.png",
    description: "Som no veículo por 30 dias. Use /som dentro do carro.",
    benefits: ["Acesso ao /som por 30 dias"]
  },
  {
    id: "crp_100",
    name: "100 CRP",
    category: "crp",
    price: 24.99,
    amount: 100,
    image: "/imagens/loja.png",
    description: "Pacote inicial de Cordova Real Points.",
    benefits: ["100 CRP na conta do passaporte"]
  },
  {
    id: "crp_500",
    name: "500 CRP",
    category: "crp",
    price: 59.99,
    amount: 500,
    image: "/imagens/loja.png",
    description: "Pacote intermediário de Cordova Real Points.",
    benefits: ["500 CRP na conta do passaporte"]
  },
  {
    id: "crp_1000",
    name: "1000 CRP",
    category: "crp",
    price: 99.99,
    amount: 1000,
    image: "/imagens/loja.png",
    description: "Pacote maior de Cordova Real Points.",
    benefits: ["1000 CRP na conta do passaporte"]
  }
];

export function findProduct(id: string) {
  return products.find((item) => item.id === id);
}

export function formatBrl(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
