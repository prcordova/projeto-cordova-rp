export type OrgDossier = {
  id: string;
  title: string;
  summary: string;
  role: string;
  produces: string;
  place: string;
  work: string[];
  ranks: string;
  commands: string[];
  kit: string[];
  missing: string[];
};

const kit = [
  "1 ficha de blip de garagem. Depois do pagamento, use /resgatartoken para marcar o ponto.",
  "1 baú pessoal no nível 1: 500 kg.",
  "Baú geral no nível 1: 1000 kg e 10 slots.",
  "Baú da liderança no nível 1: 1000 kg e 3 slots.",
  "Garagem da organização no nível 1: 2 vagas.",
  "Teto de 10 membros no nível 1.",
  "Painel da organização nos comandos /org e /orgs."
];

const policeCommands = [
  "Bater ponto no menu ESC.",
  "G algema ou desalgema quem está a até 2 m, fora do veículo.",
  "H carrega ou solta a pessoa mais próxima, fora do veículo.",
  "/p envia a localização para os policiais em serviço.",
  "/rg mostra a identidade de quem está perto.",
  "/apreender tira armas e itens ilegais de quem está a até 3 m.",
  "/confiscarsom para o som da caixa ou do carro próximo.",
  "/detido apreende o veículo mais próximo e pede o motivo.",
  "/multar pede passaporte, valor e motivo.",
  "/re reanima quem está em coma a até 2 m.",
  "/cv coloca a pessoa no veículo e /rv tira do veículo.",
  "/placa consulta a placa do veículo próximo.",
  "F5 abre os chamados policiais.",
  "/rmascara, /rchapeu e /rcapuz mexem na roupa de quem está perto.",
  "/cone, /barreira e /spike colocam o objeto à frente.",
  "/arsenal abre o arsenal. /extras abre os extras do veículo.",
  "/tablet abre o tablet. /ptr2 lista quem está em serviço.",
  "/ocorrencia pede passaporte e o texto da ocorrência.",
  "/dv apaga o veículo mais próximo e só a liderança usa.",
  "/911 anuncia na cidade. /pd fala só com a polícia em serviço. /anuncio abre um anúncio geral."
];

const weaponCraft = "Fabrica pistola MK2, pistola SNS MK2, machine pistol, micro SMG, SMG MK2, escopeta de cano serrado, fuzil e fuzil MK2.";
const ammoCraft = "Fabrica 20 munições por craft de pistola MK2, pistola SNS MK2, machine pistol, micro SMG, SMG MK2, escopeta de cano serrado, fuzil e fuzil MK2.";
const washCraft = "Lava dinheiro sujo em dinheiro e fabrica C4, pendrive, algemas, colete, lockpick e capuz.";
const routeOff = "A rota para começar ainda está em 0, 0, 0.";
const noChat = "Sem comando de chat.";

function entry(data: Omit<OrgDossier, "kit">): OrgDossier {
  return { ...data, kit };
}

const catalog: OrgDossier[] = [
  entry({
    id: "hospital",
    title: "Hospital",
    summary: "Atendimento médico. Reanima, trata e atende chamado.",
    role: "Organização de saúde. O baú da cidade é HOSPITAL.",
    produces: "Reanimação, tratamento e chamado médico.",
    place: "Hospital",
    work: ["Reanima quem está em coma e trata quem está consciente.", "Atende chamado médico pelo F5."],
    ranks: "DiretorHP, Medico, Paramedico, Enfermeiro. O dono fica acima, em OwnerHospital.",
    commands: [
      "Bater ponto no menu ESC.",
      "H carrega a pessoa mais próxima, fora do veículo.",
      "/re reanima quem está em coma a até 2 m e cobra R$100 do paciente.",
      "/tratamento trata quem está consciente a até 3 m e cobra R$100.",
      "F5 abre os chamados médicos.",
      "/ems mostra quantos paramédicos estão em serviço.",
      "/dv apaga o veículo mais próximo e só o Diretor usa.",
      "/112 anuncia o hospital na cidade. /pr fala só com a equipe em serviço."
    ],
    missing: []
  }),
  entry({
    id: "Bombeiros",
    title: "Bombeiros",
    summary: "Corpo de Bombeiros. Farm AFK de dinheiro.",
    role: "Organização de bombeiros. O topo atual é ComandoGeralBombeiro.",
    produces: "Farm AFK de dinheiro.",
    place: "Farm AFK dos Bombeiros",
    work: ["Farm AFK ligado: 1 dinheiro a cada 60 segundos."],
    ranks: "ComandoGeralBombeiro, SubComandoBombeiro, CoronelBombeiro, TenCoronelBombeiro, MajorBombeiro, CapitaoBombeiro, TenenteBombeiro, SubtenenteBombeiro, SargentoBombeiro, CaboBombeiro, SoldadoBombeiro. O dono fica acima, em OwnerBombeiros.",
    commands: [],
    missing: ["Sem comando de chat.", "O baú BOMBEIROS não está na lista atual de baús.", "Sem blip da sede no mapa."]
  }),
  entry({
    id: "PM",
    title: "Polícia Militar",
    summary: "Patrulha, apreensão, multa e chamado.",
    role: "Organização policial. O baú da cidade é PM. Os comandos valem com o ponto batido.",
    produces: "Patrulha, apreensão, multa e chamado.",
    place: "Polícia Militar",
    work: ["Patrulha, apreensão, multa e chamado policial.", "O arsenal abre com /arsenal."],
    ranks: "LiderPM, Coronel, TenCoronel, Capitão, Tenente, Sargento, Soldado, Recruta. O dono fica acima, em OwnerPM.",
    commands: policeCommands,
    missing: []
  }),
  entry({
    id: "PRF",
    title: "PRF",
    summary: "Polícia rodoviária. Patrulha, apreensão, multa e chamado.",
    role: "Organização policial. O baú da cidade é PRF. Os comandos valem com o ponto batido.",
    produces: "Patrulha, apreensão, multa e chamado.",
    place: "PRF",
    work: ["Patrulha, apreensão, multa e chamado.", "O arsenal abre com /arsenal."],
    ranks: "LiderPRF e PRF. O dono fica acima, em OwnerPRF.",
    commands: policeCommands,
    missing: []
  }),
  entry({
    id: "Exercito",
    title: "Exército",
    summary: "Exército. Patrulha, apreensão, multa e chamado.",
    role: "Organização policial. O baú da cidade é EXERCITO. Os comandos valem com o ponto batido.",
    produces: "Patrulha, apreensão, multa e chamado.",
    place: "Exército Brasileiro",
    work: ["Patrulha, apreensão, multa e chamado.", "O arsenal abre com /arsenal."],
    ranks: "LiderExercito e Exercito. O dono fica acima, em OwnerExercito.",
    commands: policeCommands,
    missing: []
  }),
  entry({
    id: "PolicialCivil",
    title: "Polícia Civil",
    summary: "Polícia civil. Patrulha e farm AFK de dinheiro.",
    role: "Organização policial. O baú da cidade é POLICIA-CIVIL. Os comandos valem com o ponto batido.",
    produces: "Patrulha, apreensão, multa, chamado e farm AFK de dinheiro.",
    place: "Polícia Civil",
    work: ["Patrulha, apreensão, multa e chamado.", "O arsenal abre com /arsenal.", "Farm AFK ligado: 1 dinheiro a cada 60 segundos."],
    ranks: "LiderCivil e PolicialCivil. O dono fica acima, em OwnerPolicialCivil.",
    commands: policeCommands,
    missing: []
  }),
  entry({
    id: "ROTA",
    title: "ROTA",
    summary: "ROTA. Patrulha, apreensão, multa e chamado.",
    role: "Organização policial. O baú da cidade é ROTA. Os comandos valem com o ponto batido.",
    produces: "Patrulha, apreensão, multa e chamado.",
    place: "ROTA",
    work: ["Patrulha, apreensão, multa e chamado.", "O arsenal abre com /arsenal."],
    ranks: "LiderROTA e ROTA. O dono fica acima, em OwnerROTA.",
    commands: policeCommands,
    missing: []
  }),
  entry({
    id: "TribunalJustica",
    title: "Tribunal de Justiça",
    summary: "Tribunal. Processos, identidade e condução.",
    role: "Organização jurídica. Os comandos valem com o ponto batido.",
    produces: "Processos, identidade e condução.",
    place: "Tribunal",
    work: ["Abre processos em /causas.", "Mostra identidade e conduz a pessoa."],
    ranks: "Juiz, SecretarioJustica, Promotor, Advogado, OficialJustica, PeritoJudicial, Conciliador, AssistenteJuridico. O dono fica acima, em OwnerTribunalJustica.",
    commands: [
      "Bater ponto no menu ESC.",
      "G algema ou desalgema quem está a até 2 m, fora do veículo.",
      "H carrega ou solta a pessoa mais próxima, fora do veículo.",
      "/causas abre o tribunal. /casos faz a mesma coisa.",
      "/rg mostra a identidade de quem está perto.",
      "/rmascara, /rchapeu e /rcapuz mexem na roupa de quem está perto.",
      "/cv coloca a pessoa no veículo e /rv tira do veículo.",
      "/911 anuncia na cidade e só o Juiz envia."
    ],
    missing: ["O baú TRIBUNAL não está na lista atual de baús.", "Sem blip da sede no mapa."]
  }),
  entry({
    id: "Restaurante",
    title: "Restaurante",
    summary: "Restaurante. Ponto no local de trabalho.",
    role: "Organização de restaurante.",
    produces: "Ponto no local de trabalho.",
    place: "Restaurante",
    work: ["Bate ponto no menu ESC."],
    ranks: "ChefeCozinha, GerenteRestaurante, Cozinheiro. O dono fica acima, em OwnerRestaurante.",
    commands: ["Bater ponto no menu ESC."],
    missing: ["Farm AFK de ingredientes desligado e sem ponto.", "O baú Restaurante não está na lista atual de baús.", "Sem blip da sede no mapa."]
  }),
  entry({
    id: "Redline",
    title: "Redline",
    summary: "Oficina. Repara veículo e anuncia a central mecânica.",
    role: "Mecânica legal. O baú da cidade é REDLINE. Os comandos valem com o ponto batido.",
    produces: "Reparo de veículo e anúncio da central mecânica.",
    place: "Mecânica",
    work: ["Repara o veículo mais próximo.", "Anuncia a central mecânica na cidade."],
    ranks: "RedlineChefe, Redline, RedlineRecruta. O dono fica acima, em OwnerRedline.",
    commands: [
      "Bater ponto no menu ESC.",
      "/reparar conserta o veículo mais próximo, fora do carro. A animação leva cerca de 20 segundos.",
      "/dv apaga o veículo mais próximo.",
      "/mec anuncia a central mecânica na cidade.",
      "/mr fala só com a Redline em serviço."
    ],
    missing: []
  }),
  entry({
    id: "Speed",
    title: "Speed",
    summary: "Mecânica ilegal e desmanche.",
    role: "Facção de desmanche e mecânica. O baú da cidade é SPEED.",
    produces: "Desmanche, reparo e chamado de mecânico.",
    place: "Mecânica",
    work: ["Desmanche de veículo.", "Reparo e chamado de mecânico.", "A rota de desmanche entrega chave."],
    ranks: "LiderSpeed, GerenteSpeed, Speed. O dono fica acima, em OwnerSpeed.",
    commands: [
      "/reparar conserta o veículo mais próximo, fora do carro.",
      "/rgbcar aplica a pintura RGB no veículo.",
      "/cone e /barreira colocam o objeto à frente.",
      "/placa consulta a placa do veículo próximo."
    ],
    missing: ["Não bate ponto.", "Farm AFK desligado e sem ponto.", routeOff]
  }),
  entry({
    id: "Furious",
    title: "Furious",
    summary: "Desmanche de veículo.",
    role: "Facção de desmanche. O baú da cidade é FURIOUS.",
    produces: "Desmanche de veículo.",
    place: "",
    work: ["Desmanche de veículo.", "A rota de desmanche entrega chave."],
    ranks: "LiderFurious, GerenteFurious, Furious. O dono fica acima, em OwnerFurious.",
    commands: ["/placa consulta a placa do veículo próximo."],
    missing: ["Não bate ponto.", "Sem rádio.", "Farm AFK desligado e sem ponto.", routeOff, "Sem blip de área de risco com o nome da Furious."]
  }),
  entry({
    id: "Tequila",
    title: "Tequila",
    summary: "Facção Tequila.",
    role: "Facção Tequila.",
    produces: "Facção Tequila.",
    place: "",
    work: [],
    ranks: "LiderTequila, GerenteTequila, Tequila. O dono fica acima, em OwnerTequila.",
    commands: [],
    missing: ["Sem produção cadastrada.", "Sem comando exclusivo.", "O baú Tequila não está na lista atual de baús.", "No groups só o dono está cadastrado.", "Sem blip de área de risco no mapa."]
  }),
  entry({
    id: "ADA",
    title: "ADA",
    summary: "Facção de droga.",
    role: "Amigos dos Amigos. O baú da cidade é ADA.",
    produces: "Farm de droga.",
    place: "Área de Risco",
    work: ["Farm de droga."],
    ranks: "LiderADA, GerenteADA, ADA. O dono fica acima, em OwnerADA.",
    commands: [],
    missing: [noChat, "Farm AFK desligado e sem ponto.", "Rota de drogas desligada.", "Sem bancada com uma droga específica."]
  }),
  entry({
    id: "PCC",
    title: "PCC",
    summary: "Facção de droga.",
    role: "Primeiro Comando da Capital. O baú da cidade é PCC.",
    produces: "Farm de droga.",
    place: "Área de Risco",
    work: ["Farm de droga."],
    ranks: "LiderPCC, GerentePCC, PCC. O dono fica acima, em OwnerPCC.",
    commands: [],
    missing: [noChat, "Farm AFK desligado e sem ponto.", "Rota de drogas desligada.", "Sem bancada com uma droga específica."]
  }),
  entry({
    id: "Turquia",
    title: "Turquia",
    summary: "Facção de droga.",
    role: "Facção Turquia. O baú da cidade é TURQUIA.",
    produces: "Farm de droga.",
    place: "",
    work: ["Farm de droga."],
    ranks: "LiderTurquia, GerenteTurquia, Turquia. O dono fica acima, em OwnerTurquia.",
    commands: [],
    missing: [noChat, "Farm AFK desligado e sem ponto.", "Rota de drogas desligada.", "Sem bancada com uma droga específica.", "Sem blip de área de risco no mapa."]
  }),
  entry({
    id: "TDC",
    title: "TDC",
    summary: "Croácia. Farm de munição.",
    role: "Tropa da Croácia. O baú da cidade é CROACIA.",
    produces: "Farm de munição.",
    place: "Área de Risco",
    work: ["Farm de munição.", ammoCraft, "A rota entrega cápsulas, pólvora e ferro."],
    ranks: "LiderTDC, GerenteTDC, TDC. O dono fica acima, em OwnerTDC.",
    commands: [],
    missing: [noChat, "Farm AFK desligado e sem ponto.", routeOff]
  }),
  entry({
    id: "TremBala",
    title: "Trem Bala",
    summary: "Farm de munição. Farm AFK de cápsulas, pólvora e ferro.",
    role: "Facção Trem Bala. O baú da cidade é TREM-BALA.",
    produces: "Farm de munição.",
    place: "Área de Risco",
    work: ["Farm de munição.", ammoCraft, "A rota entrega cápsulas, pólvora e ferro.", "Farm AFK ligado: a cada 60 segundos entrega 1 cápsula, 1 pólvora, 1 ferro e 1 dinheiro."],
    ranks: "LiderTremBala, GerenteTremBala, TremBala. O dono fica acima, em OwnerTremBala.",
    commands: [],
    missing: [noChat, routeOff]
  }),
  entry({
    id: "Mafia",
    title: "Máfia",
    summary: "Farm de armas.",
    role: "Facção Máfia. O baú da cidade é MAFIA.",
    produces: "Farm de armas.",
    place: "Área de Risco",
    work: ["Farm de armas.", weaponCraft, "A rota entrega peça de arma, molas, gatilho, corpo de arma e dinheiro sujo."],
    ranks: "LiderMafia, GerenteMafia, Mafia. O dono fica acima, em OwnerMafia.",
    commands: [],
    missing: [noChat, "Farm AFK desligado e sem ponto.", routeOff]
  }),
  entry({
    id: "Japao",
    title: "Japão",
    summary: "Farm de armas. Farm AFK de peças.",
    role: "Facção Japão. O baú da cidade é JAPAO.",
    produces: "Farm de armas.",
    place: "Área de Risco",
    work: ["Farm de armas.", weaponCraft, "A rota entrega peça de arma, molas, gatilho, corpo de arma e dinheiro sujo.", "Farm AFK ligado: a cada 60 segundos entrega 1 peça de arma, 1 mola, 1 gatilho, 1 corpo de arma e 1 dinheiro."],
    ranks: "LiderJapao, GerenteJapao, Japao. O dono fica acima, em OwnerJapao.",
    commands: [],
    missing: [noChat, routeOff]
  }),
  entry({
    id: "Vanilla",
    title: "Vanilla",
    summary: "Lavagem de dinheiro.",
    role: "Facção Vanilla. O baú da cidade é VANILLA.",
    produces: "Lavagem de dinheiro.",
    place: "Vanilla",
    work: ["Lavagem de dinheiro.", washCraft, "A rota entrega plástico, cobre, borracha, alumínio, linha e tesoura."],
    ranks: "LiderVanilla, GerenteVanilla, Vanilla. O dono fica acima, em OwnerVanilla.",
    commands: [],
    missing: [noChat, "Farm AFK desligado e sem ponto.", routeOff]
  }),
  entry({
    id: "Bahamas",
    title: "Bahamas",
    summary: "Lavagem de dinheiro.",
    role: "Facção Bahamas. O baú da cidade é BAHAMAS.",
    produces: "Lavagem de dinheiro.",
    place: "Bahamas",
    work: ["Lavagem de dinheiro.", washCraft, "A rota entrega plástico, cobre, borracha, alumínio, linha e tesoura."],
    ranks: "LiderBahamas, GerenteBahamas, Bahamas. O dono fica acima, em OwnerBahamas.",
    commands: [],
    missing: [noChat, "Farm AFK desligado e sem ponto.", routeOff]
  })
];

export function orgDossier(id: string) {
  const key = id.toLocaleLowerCase("pt-BR");
  return catalog.find((item) => item.id.toLocaleLowerCase("pt-BR") === key || item.title.toLocaleLowerCase("pt-BR") === key);
}
