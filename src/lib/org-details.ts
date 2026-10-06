export type OrgDossier = {
  id: string;
  title: string;
  summary: string;
  role: string;
  produces: string;
  drugs: string;
  weapons: string;
  ammo: string;
  ranks: string;
  commands: string[];
  kit: string[];
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

function entry(data: Omit<OrgDossier, "kit" | "drugs" | "weapons" | "ammo"> & Partial<Pick<OrgDossier, "drugs" | "weapons" | "ammo">>): OrgDossier {
  return {
    drugs: "Não produz droga.",
    weapons: "Não fabrica arma.",
    ammo: "Não fabrica munição.",
    ...data,
    kit
  };
}

const catalog: OrgDossier[] = [
  entry({
    id: "hospital",
    title: "Hospital",
    summary: "Atendimento médico. Reanima, trata e atende chamado.",
    role: "Organização de saúde. O baú da cidade é HOSPITAL.",
    produces: "Não produz droga, arma nem munição. O serviço é reanimação e tratamento.",
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
    ]
  }),
  entry({
    id: "Bombeiros",
    title: "Bombeiros",
    summary: "Corpo de Bombeiros. Farm AFK de dinheiro ligado. Sem comando de chat.",
    role: "Organização de bombeiros. O topo atual continua ComandoGeralBombeiro. O baú da cidade previsto é BOMBEIROS, mas esse nome não está na lista atual de baús.",
    produces: "Não produz droga, arma nem munição. O farm AFK está ligado e entrega 1 dinheiro a cada 60 segundos.",
    ranks: "ComandoGeralBombeiro, SubComandoBombeiro, CoronelBombeiro, TenCoronelBombeiro, MajorBombeiro, CapitaoBombeiro, TenenteBombeiro, SubtenenteBombeiro, SargentoBombeiro, CaboBombeiro, SoldadoBombeiro. O dono fica acima, em OwnerBombeiros.",
    commands: ["Não há comando exclusivo cadastrado para o Corpo de Bombeiros."]
  }),
  entry({
    id: "PM",
    title: "Polícia Militar",
    summary: "Polícia militar. Patrulha, apreensão, multa e chamado.",
    role: "Organização policial. O baú da cidade é PM. Os comandos valem com o ponto batido.",
    produces: "Não produz droga, arma ilegal nem munição. O arsenal abre com /arsenal.",
    ranks: "LiderPM, Coronel, TenCoronel, Capitão, Tenente, Sargento, Soldado, Recruta. O dono fica acima, em OwnerPM.",
    commands: policeCommands
  }),
  entry({
    id: "PRF",
    title: "PRF",
    summary: "Polícia rodoviária. Mesmos comandos da polícia.",
    role: "Organização policial. O baú da cidade é PRF. Os comandos valem com o ponto batido.",
    produces: "Não produz droga, arma ilegal nem munição. O arsenal abre com /arsenal.",
    ranks: "LiderPRF e PRF. O dono fica acima, em OwnerPRF.",
    commands: policeCommands
  }),
  entry({
    id: "Exercito",
    title: "Exército",
    summary: "Exército. Mesmos comandos da polícia.",
    role: "Organização policial. O baú da cidade é EXERCITO. Os comandos valem com o ponto batido.",
    produces: "Não produz droga, arma ilegal nem munição. O arsenal abre com /arsenal.",
    ranks: "LiderExercito e Exercito. O dono fica acima, em OwnerExercito.",
    commands: policeCommands
  }),
  entry({
    id: "PolicialCivil",
    title: "Polícia Civil",
    summary: "Polícia civil. Mesmos comandos da polícia. Farm AFK de dinheiro ligado.",
    role: "Organização policial. O baú da cidade é POLICIA-CIVIL. Os comandos valem com o ponto batido.",
    produces: "Não produz droga, arma ilegal nem munição. O arsenal abre com /arsenal. O farm AFK está ligado e entrega 1 dinheiro a cada 60 segundos.",
    ranks: "LiderCivil e PolicialCivil. O dono fica acima, em OwnerPolicialCivil.",
    commands: policeCommands
  }),
  entry({
    id: "ROTA",
    title: "ROTA",
    summary: "ROTA. Mesmos comandos da polícia.",
    role: "Organização policial. O baú da cidade é ROTA. Os comandos valem com o ponto batido.",
    produces: "Não produz droga, arma ilegal nem munição. O arsenal abre com /arsenal.",
    ranks: "LiderROTA e ROTA. O dono fica acima, em OwnerROTA.",
    commands: policeCommands
  }),
  entry({
    id: "TribunalJustica",
    title: "Tribunal de Justiça",
    summary: "Tribunal. Processos, identidade e condução.",
    role: "Organização jurídica. O baú da cidade é TRIBUNAL. Os comandos valem com o ponto batido.",
    produces: "Não produz droga, arma nem munição.",
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
    ]
  }),
  entry({
    id: "Restaurante",
    title: "Restaurante",
    summary: "Restaurante. O ponto e as bebidas ficam no local de trabalho.",
    role: "Organização legal. O baú configurado é Restaurante.",
    produces: "Não produz droga, arma nem munição. O farm de ingredientes (leite, trigo, molho de tomate, queijo, macarrão, carne de hambúrguer, tempero, pão, legumes e carne moída) está desligado, sem ponto no mapa.",
    ranks: "ChefeCozinha, GerenteRestaurante, Cozinheiro. O dono fica acima, em OwnerRestaurante.",
    commands: ["Bater ponto no menu ESC."]
  }),
  entry({
    id: "Redline",
    title: "Redline",
    summary: "Oficina. Repara veículo e anuncia a central mecânica.",
    role: "Mecânica legal. O baú da cidade é REDLINE. Os comandos valem com o ponto batido.",
    produces: "Não produz droga, arma nem munição. O serviço é reparo de veículo.",
    ranks: "RedlineChefe, Redline, RedlineRecruta. O dono fica acima, em OwnerRedline.",
    commands: [
      "Bater ponto no menu ESC.",
      "/reparar conserta o veículo mais próximo, fora do carro. A animação leva cerca de 20 segundos.",
      "/dv apaga o veículo mais próximo.",
      "/mec anuncia a central mecânica na cidade.",
      "/mr fala só com a Redline em serviço."
    ]
  }),
  entry({
    id: "Speed",
    title: "Speed",
    summary: "Mecânica ilegal e desmanche. Não bate ponto.",
    role: "Facção com desmanche, reparo e chamado de mecânico. O baú da cidade é SPEED.",
    produces: "Desmanche, reparo e chamado de mecânico. Não produz droga, arma nem munição. A rota de desmanche entrega chave, mas o ponto para começar ainda está em 0, 0, 0. O farm AFK está desligado.",
    ranks: "LiderSpeed, GerenteSpeed, Speed. O dono fica acima, em OwnerSpeed.",
    commands: [
      "Não bate ponto. Os comandos valem com o cargo ativo.",
      "/reparar conserta o veículo mais próximo, fora do carro.",
      "/rgbcar aplica a pintura RGB no veículo.",
      "/cone e /barreira colocam o objeto à frente.",
      "/placa consulta a placa do veículo próximo."
    ]
  }),
  entry({
    id: "Furious",
    title: "Furious",
    summary: "Desmanche. Sem rádio e sem ponto.",
    role: "Facção de desmanche. O baú da cidade é Furious. O desmanche abre no local da facção.",
    produces: "Desmanche de veículo. Não fabrica droga, arma nem munição. A rota de desmanche entrega chave, mas o ponto para começar ainda está em 0, 0, 0. O farm AFK está desligado. Não tem rádio nem ponto.",
    ranks: "LiderFurious, GerenteFurious, Furious. O dono fica acima, em OwnerFurious.",
    commands: ["/placa consulta a placa do veículo próximo."]
  }),
  entry({
    id: "Tequila",
    title: "Tequila",
    summary: "Facção Tequila. Sem produção e sem comando exclusivo.",
    role: "Facção com baú Tequila. Não há produção nem comando exclusivo cadastrados para o cargo.",
    produces: "Não produz droga, arma, munição, desmanche nem lavagem. O baú configurado se chama Tequila, mas esse nome não está na lista atual de baús. No painel existem líder, gerente e membro; no groups só está cadastrado o dono.",
    ranks: "LiderTequila, GerenteTequila, Tequila. O dono fica acima, em OwnerTequila.",
    commands: ["Não há comando exclusivo cadastrado para a Tequila."]
  }),
  entry({
    id: "ADA",
    title: "ADA",
    summary: "Facção de droga. Sem arma e sem munição. A produção específica ainda não está ligada.",
    role: "Amigos dos Amigos. O baú da cidade é ADA. Não tem comando de chat.",
    produces: "Droga. Não fabrica arma nem munição.",
    drugs: "Permissão drogas.permissao. Hoje não há bancada de droga nem uma droga reservada para a ADA. A rota de drogas está desligada. O farm AFK está sem ponto e, no preset atual, entregaria só dinheiro.",
    ranks: "LiderADA, GerenteADA, ADA. O dono fica acima, em OwnerADA.",
    commands: ["Não há comando de chat. A produção de droga não está ligada."]
  }),
  entry({
    id: "PCC",
    title: "PCC",
    summary: "Facção de droga. Sem arma e sem munição. A produção específica ainda não está ligada.",
    role: "Primeiro Comando da Capital. O baú da cidade é PCC. Não tem comando de chat.",
    produces: "Droga. Não fabrica arma nem munição.",
    drugs: "Permissão drogas.permissao. Hoje não há bancada de droga nem uma droga reservada para o PCC. A rota de drogas está desligada. O farm AFK está sem ponto e, no preset atual, entregaria só dinheiro.",
    ranks: "LiderPCC, GerentePCC, PCC. O dono fica acima, em OwnerPCC.",
    commands: ["Não há comando de chat. A produção de droga não está ligada."]
  }),
  entry({
    id: "Turquia",
    title: "Turquia",
    summary: "Facção de droga. Sem arma e sem munição. A produção específica ainda não está ligada.",
    role: "Facção Turquia. O baú da cidade é TURQUIA. Não tem comando de chat.",
    produces: "Droga. Não fabrica arma nem munição.",
    drugs: "Permissão drogas.permissao. Hoje não há bancada de droga nem uma droga reservada para a Turquia. A rota de drogas está desligada. O farm AFK está sem ponto e, no preset atual, entregaria só dinheiro.",
    ranks: "LiderTurquia, GerenteTurquia, Turquia. O dono fica acima, em OwnerTurquia.",
    commands: ["Não há comando de chat. A produção de droga não está ligada."]
  }),
  entry({
    id: "TDC",
    title: "TDC",
    summary: "Croácia. Produção de munição. Farm AFK desligado.",
    role: "Tropa da Croácia. O baú da cidade é CROACIA. Não tem comando de chat.",
    produces: "Munição. Não produz droga nem arma.",
    ammo: "Permissão municao.permissao. Cada fabricação entrega 20 munições de pistola MK2, pistola SNS MK2, machine pistol, micro SMG, SMG MK2, escopeta de cano serrado, fuzil ou fuzil MK2. A rota entrega cápsulas, pólvora e ferro, mas o ponto para começar ainda está em 0, 0, 0. O farm AFK da TDC está desligado.",
    ranks: "LiderTDC, GerenteTDC, TDC. O dono fica acima, em OwnerTDC.",
    commands: ["Não há comando de chat. A produção de munição abre no ponto da facção."]
  }),
  entry({
    id: "TremBala",
    title: "Trem Bala",
    summary: "Produção de munição. Farm AFK de cápsulas, pólvora e ferro ligado.",
    role: "Facção Trem Bala. O baú da cidade é TREM-BALA. Não tem comando de chat.",
    produces: "Munição. Não produz droga nem arma.",
    ammo: "Permissão municao.permissao. Cada fabricação entrega 20 munições de pistola MK2, pistola SNS MK2, machine pistol, micro SMG, SMG MK2, escopeta de cano serrado, fuzil ou fuzil MK2. A rota entrega cápsulas, pólvora e ferro, mas o ponto para começar ainda está em 0, 0, 0. O farm AFK está ligado e, a cada 60 segundos, entrega 1 cápsula, 1 pólvora, 1 ferro e 1 dinheiro.",
    ranks: "LiderTremBala, GerenteTremBala, TremBala. O dono fica acima, em OwnerTremBala.",
    commands: ["Não há comando de chat. A produção de munição abre no ponto da facção."]
  }),
  entry({
    id: "Mafia",
    title: "Máfia",
    summary: "Produção de armas. Farm AFK desligado.",
    role: "Facção Máfia. O baú da cidade é MAFIA. Não tem comando de chat.",
    produces: "Armas. Não produz droga nem munição.",
    weapons: "Permissão armas.permissao. Fabrica pistola MK2, pistola SNS MK2, machine pistol, micro SMG, SMG MK2, escopeta de cano serrado, fuzil e fuzil MK2. A rota entrega peça de arma, molas, gatilho, corpo de arma e dinheiro sujo, mas o ponto para começar ainda está em 0, 0, 0. O farm AFK da Máfia está desligado.",
    ranks: "LiderMafia, GerenteMafia, Mafia. O dono fica acima, em OwnerMafia.",
    commands: ["Não há comando de chat. A produção de armas abre no ponto da facção."]
  }),
  entry({
    id: "Japao",
    title: "Japão",
    summary: "Produção de armas. Farm AFK de peças ligado.",
    role: "Facção Japão. O baú da cidade é JAPAO. Não tem comando de chat.",
    produces: "Armas. Não produz droga nem munição.",
    weapons: "Permissão armas.permissao. Fabrica pistola MK2, pistola SNS MK2, machine pistol, micro SMG, SMG MK2, escopeta de cano serrado, fuzil e fuzil MK2. A rota entrega peça de arma, molas, gatilho, corpo de arma e dinheiro sujo, mas o ponto para começar ainda está em 0, 0, 0. O farm AFK está ligado e, a cada 60 segundos, entrega 1 peça de arma, 1 mola, 1 gatilho, 1 corpo de arma e 1 dinheiro.",
    ranks: "LiderJapao, GerenteJapao, Japao. O dono fica acima, em OwnerJapao.",
    commands: ["Não há comando de chat. A produção de armas abre no ponto da facção."]
  }),
  entry({
    id: "Vanilla",
    title: "Vanilla",
    summary: "Lavagem de dinheiro no ponto da facção.",
    role: "Facção Vanilla. O baú da cidade é VANILLA. Não tem comando de chat.",
    produces: "Lavagem. Não produz droga, arma nem munição. Troca dinheiro sujo por dinheiro e fabrica C4, pendrive, algemas, colete, lockpick e capuz. A rota entrega plástico, cobre, borracha, alumínio, linha e tesoura, mas o ponto para começar ainda está em 0, 0, 0. O farm AFK está desligado.",
    ranks: "LiderVanilla, GerenteVanilla, Vanilla. O dono fica acima, em OwnerVanilla.",
    commands: ["Não há comando de chat. A lavagem abre no ponto da facção."]
  }),
  entry({
    id: "Bahamas",
    title: "Bahamas",
    summary: "Lavagem de dinheiro no ponto da facção.",
    role: "Facção Bahamas. O baú da cidade é BAHAMAS. Não tem comando de chat.",
    produces: "Lavagem. Não produz droga, arma nem munição. Troca dinheiro sujo por dinheiro e fabrica C4, pendrive, algemas, colete, lockpick e capuz. A rota entrega plástico, cobre, borracha, alumínio, linha e tesoura, mas o ponto para começar ainda está em 0, 0, 0. O farm AFK está desligado.",
    ranks: "LiderBahamas, GerenteBahamas, Bahamas. O dono fica acima, em OwnerBahamas.",
    commands: ["Não há comando de chat. A lavagem abre no ponto da facção."]
  })
];

export function orgDossier(id: string) {
  const key = id.toLocaleLowerCase("pt-BR");
  return catalog.find((item) => item.id.toLocaleLowerCase("pt-BR") === key || item.title.toLocaleLowerCase("pt-BR") === key);
}
