export interface BonusItem {
  id: number;
  title: string;
  description: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  role: string;
  avatar: string;
  text: string;
  rating: number;
  date: string;
}

export interface BagModel {
  id: number;
  title: string;
  category: string;
  filamentUsed: string;
  printTime: string;
  suggestedPrice: string;
  image: string;
  difficulty: "Fácil" | "Médio" | "Avançado";
}

export const BONUSES: BonusItem[] = [
  {
    id: 1,
    title: "Guia Rápido de Organização dos Arquivos",
    description: "Para você encontrar tudo com facilidade e iniciar a impressão imediatamente sem perder tempo ou ficar confuso com pastas."
  },
  {
    id: 2,
    title: "Checklist de Postagem no Instagram",
    description: "O roteiro exato do que postar nos seus stories e feed para mostrar suas peças do jeito certo e gerar os primeiros interessados."
  },
  {
    id: 6,
    title: "Lista de Públicos para Oferecer",
    description: "Descubra quem são as pessoas com maior probabilidade de comprar e quais ocasiões (casamentos, festas, presentes) geram mais pedidos."
  },
  {
    id: 7,
    title: "Plano Prático de 7 Dias para Começar",
    description: "Um passo a passo sequencial estruturado para você sair da teoria, colocar os arquivos na impressora e iniciar suas divulgações em uma semana."
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 1,
    question: "Funciona mesmo na minha impressora?",
    answer: "Sim! Os arquivos STL são universais e compatíveis com todas as marcas de impressoras 3D FDM do mercado (como Creality Ender, Bambu Lab, Anycubic, Artillery, etc.). Os modelos são fatiados e organizados de forma simples para facilitar a impressão."
  },
  {
    id: 2,
    question: "Preciso ter experiência avançada ou saber modelar?",
    answer: "Não! Você não precisa saber modelar absolutamente nada. Todos os modelos vêm prontos para download em formato STL. Basta colocar no seu fatiador de preferência, configurar de acordo com as instruções básicas e imprimir."
  },
  {
    id: 3,
    question: "Como e quando vou receber os arquivos?",
    answer: "O envio é 100% imediato. Assim que o pagamento for confirmado (no Pix é instantâneo), você receberá um e-mail com seus dados de acesso exclusivos à nossa área de membros, onde poderá baixar todos os arquivos organizados por pastas."
  },
  {
    id: 4,
    question: "Posso vender as peças impressas fisicamente?",
    answer: "Sim! Você tem permissão comercial vitalícia inclusa no pack. Isso significa que você pode imprimir quantas bolsas quiser e vendê-las como produto físico em sua região, loja física ou Instagram. Apenas a revenda ou distribuição dos arquivos digitais é proibida."
  },
  {
    id: 5,
    question: "É difícil de imprimir ou gasta muito material?",
    answer: "Os modelos foram selecionados estrategicamente por serem multipartes inteligentes. Isso significa que as peças se encaixam de forma otimizada para evitar o uso excessivo de suportes, o que economiza muito filamento e garante um acabamento limpo. No pack ensinamos os melhores parâmetros de fatiamento."
  },
  {
    id: 6,
    question: "Qual pack vale mais a pena?",
    answer: "Se você quer apenas os arquivos de bolsas, o Pack Básico de R$10,90 oferece os 70 modelos sem os bônus adicionais. No entanto, o Pack Completo por R$19,90 é incomparavelmente mais vantajoso, pois você ganha os mais de 70 designs, suporte individual, atualizações futuras gratuitas e todos os 6 bônus exclusivos (como Joias 3D, Estampas, Guia de Fatiamento, Caneca Premium, Kit Anéis e Guia de Cores) para impulsionar seu negócio."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Ana Cláudia Martins",
    location: "Sorocaba - SP",
    role: "Proprietária da Martins 3D Prints",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120",
    text: "Eu estava cansada de imprimir só vasinho de planta e bonequinho. Quando postei a Bolsa Clutch Prismática, minha vizinha encomendou uma na hora por R$ 180,00! Paguei o pack logo na primeira venda e já tenho lista de espera para o Dia das Mães.",
    rating: 5,
    date: "Há 3 dias"
  },
  {
    id: 2,
    name: "Roberto Silva",
    location: "Curitiba - PR",
    role: "Entusiasta de Impressão 3D",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120",
    text: "O grande diferencial do pack é o fatiamento facilitado. Muitas bolsas que baixamos na internet são mal modeladas e quebram na hora de montar. Essas aqui são realmente multipartes inteligentes, os encaixes são perfeitos e o gasto de suporte é mínimo.",
    rating: 5,
    date: "Há 1 semana"
  },
  {
    id: 3,
    name: "Camila Guimarães",
    location: "Belo Horizonte - MG",
    role: "Criadora de Acessórios Criativos",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120",
    text: "Peguei a versão completa por causa dos bônus e valeu cada centavo. As legendas prontas me ajudaram muito a divulgar no Instagram de forma profissional. Em menos de 2 semanas vendi 4 bolsas completas. Super indico!",
    rating: 5,
    date: "Há 4 dias"
  }
];

export const BAG_MODELS: BagModel[] = [
  {
    id: 1,
    title: "Bolsa Clutch Prismática (Luxo)",
    category: "Bolsas Femininas",
    filamentUsed: "PLA Silk / Metálico (~240g)",
    printTime: "12h (Velocidade Padrão)",
    suggestedPrice: "R$ 150 - R$ 220",
    difficulty: "Fácil",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600&h=450"
  },
  {
    id: 2,
    title: "Bolsa Shoulder Geometric Origami",
    category: "Bolsas Modernas",
    filamentUsed: "PETG ou PLA Premium (~280g)",
    printTime: "14h (Excelente Encaixe)",
    suggestedPrice: "R$ 180 - R$ 260",
    difficulty: "Médio",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600&h=450"
  },
  {
    id: 3,
    title: "Mini Bolsa Baú Cristal",
    category: "Bolsas Pequenas",
    filamentUsed: "Transparente PETG / PLA (~180g)",
    printTime: "8h (Efeito translúcido)",
    suggestedPrice: "R$ 110 - R$ 160",
    difficulty: "Fácil",
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc15aae9?auto=format&fit=crop&q=80&w=600&h=450"
  },
  {
    id: 4,
    title: "Maleta Handbag Vintage Elegance",
    category: "Modelos Multipartes",
    filamentUsed: "PLA Silk + Alças Fivelas (~350g)",
    printTime: "18h (Encaixes Mecânicos)",
    suggestedPrice: "R$ 220 - R$ 320",
    difficulty: "Avançado",
    image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=600&h=450"
  },
  {
    id: 5,
    title: "Clutch Escultural Wave",
    category: "Bolsas Decorativas",
    filamentUsed: "PLA Multicolor / Dual-Color (~200g)",
    printTime: "10h (Design sem suportes)",
    suggestedPrice: "R$ 140 - R$ 190",
    difficulty: "Fácil",
    image: "https://images.unsplash.com/photo-1524498250077-390f9e378db0?auto=format&fit=crop&q=80&w=600&h=450"
  }
];

export const SIMULATED_PURCHASES = [
  { name: "Juliana R.", city: "Niterói - RJ", pack: "Completo 🔥" },
  { name: "Patrícia L.", city: "Porto Alegre - RS", pack: "Básico 👍" },
  { name: "Amanda F.", city: "Salvador - BA", pack: "Completo 🔥" },
  { name: "Mariana S.", city: "Belo Horizonte - MG", pack: "Completo 🔥" },
  { name: "Camila M.", city: "Curitiba - PR", pack: "Completo 🔥" },
  { name: "Beatriz C.", city: "Recife - PE", pack: "Completo 🔥" },
  { name: "Fernanda O.", city: "Campinas - SP", pack: "Completo 🔥" },
  { name: "Letícia V.", city: "Goiânia - GO", pack: "Completo 🔥" },
  { name: "Larissa P.", city: "Blumenau - SC", pack: "Completo 🔥" },
  { name: "Gabriela G.", city: "Fortaleza - CE", pack: "Completo 🔥" },
  { name: "Bruna D.", city: "Florianópolis - SC", pack: "Completo 🔥" },
  { name: "Caroline N.", city: "Manaus - AM", pack: "Completo 🔥" }
];
