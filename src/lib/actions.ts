export const shopActions = [
  {
    value: "spawn",
    label: "Entregar veículo pelo spawn",
    command: "Não existe um comando /spawn na loja. A venda confirmada grava o veículo na garagem, permanente até o wipe.",
    fields: ["spawn"]
  },
  {
    value: "daritem",
    label: "Dar item no inventário",
    command: "Não existe o comando /daritem. A venda confirmada entrega o item pelo inventário.",
    fields: ["item", "amount"]
  },
  {
    value: "iniciaraluguelcarro",
    label: "Iniciar aluguel de carro",
    command: "Não existe /iniciaraluguelcarro. A vipshop já aluga veículo na compra. A venda confirmada coloca o spawn na garagem pelo prazo informado.",
    fields: ["spawn", "days"]
  },
  {
    value: "iniciaraluguelcasa",
    label: "Iniciar aluguel de casa",
    command: "Não existe /iniciaraluguelcasa. A compra da mansão já aplica o grupo. A venda confirmada coloca esse grupo no passaporte.",
    fields: ["group", "days"]
  },
  {
    value: "iniciaraluguelvip",
    label: "Iniciar aluguel de VIP",
    command: "Não existe /iniciaraluguelvip. A compra do VIP já aplica o grupo. A venda confirmada coloca o grupo e, se informado, o bônus no banco.",
    fields: ["group", "days", "bank"]
  },
  {
    value: "vipwipe",
    label: "Pacote VIP Wipe",
    command: "Não existe /vipwipe. A venda confirmada entrega o plano Wipe que já está no config: carro, moto e mochila até o wipe; salário, Spotify e parkour por 30 dias.",
    fields: []
  },
  {
    value: "darcrp",
    label: "Creditar CRP",
    command: "O comando que existe é /addcrp [id] [quantidade]. A venda confirmada credita a quantidade no passaporte.",
    fields: ["amount"]
  },
  {
    value: "grupo",
    label: "Liberar grupo ou permissão",
    command: "Não é um comando da loja. Spotify, parkour e cinema já entram assim. A venda confirmada aplica o grupo informado.",
    fields: ["group", "days"]
  },
  {
    value: "resetchar",
    label: "Crédito de /resetchar",
    command: "O comando /resetchar existe. A venda confirmada guarda 1 reset na conta, usado quando o jogador confirma o criador.",
    fields: []
  }
] as const;

export type ShopAction = (typeof shopActions)[number]["value"];

export type ActionParams = {
  spawn?: string;
  item?: string;
  amount?: number;
  days?: number | null;
  group?: string;
  bank?: number;
};

export function actionByValue(value: string) {
  return shopActions.find((action) => action.value === value);
}
