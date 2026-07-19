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
    question: "Posso vender as bolsas produzidas fisicamente?",
    answer: "Sim, absolutamente! Ao adquirir nosso pack, você ganha a Licença Comercial Vitalícia de Venda Física. Você pode imprimir e vender as bolsas prontas em sua região, loja física ou redes sociais pelo preço que achar mais justo (recomendamos de R$ 180 a R$ 350) e ficar com 100% do lucro. Apenas a venda dos arquivos digitais é proibida."
  },
  {
    id: 2,
    question: "Os arquivos funcionam na minha impressora 3D?",
    answer: "Sim! Os arquivos STL são universais e totalmente compatíveis com todas as marcas de impressoras 3D FDM do mercado (como Ender 3, Bambu Lab, Anycubic, Artillery, Kywoo, etc.). Basta importar para o seu fatiador habitual (Cura, PrusaSlicer, Bambu Studio) e mandar imprimir."
  },
  {
    id: 3,
    question: "Receberei futuras atualizações sem custo adicional?",
    answer: "Com certeza! Nosso acervo é dinâmico e continua crescendo. Toda vez que nossa equipe adicionar novos modelos de bolsas, acessórios ou designs exclusivos à área de membros, você terá acesso imediato e gratuito a eles, sem precisar pagar mensalidades ou taxas extras."
  },
  {
    id: 4,
    question: "Como e quando vou receber o acesso?",
    answer: "O envio é 100% imediato e automático! Assim que o seu pagamento fictício ou real for realizado (no Pix a aprovação ocorre em menos de 1 minuto), você receberá um e-mail com os dados de acesso exclusivos para a nossa área de membros VIP, de onde poderá fazer o download de qualquer arquivo."
  },
  {
    id: 5,
    question: "Preciso de conhecimento avançado para começar?",
    answer: "Não! Não é necessário ter conhecimento em modelagem 3D ou softwares complexos de engenharia. Todos os modelos já vêm 100% modelados, otimizados e prontos em formato STL. Se você sabe ligar a sua impressora 3D e usar um fatiador básico, você já consegue produzir peças luxuosas de alta qualidade."
  },
  {
    id: 6,
    question: "Existe garantia se eu mudar de ideia?",
    answer: "Sim! Oferecemos uma Garantia Incondicional Blindada de 7 Dias. Se por qualquer motivo você achar que a coleção não é para você, basta entrar em contato para receber o reembolso integral, sem ressentimentos. Seu risco é absolutamente ZERO!"
  },
  {
    id: 7,
    question: "Os arquivos são organizados de verdade?",
    answer: "Sim, e esse é um dos nossos maiores diferenciais! Esqueça de vez aquelas pastas de drive confusas, com nomes genéricos e arquivos corrompidos. Em nossa área de membros, tudo está perfeitamente catalogado por modelo, com imagens correspondentes, arquivos complementares (fechos, alças) e instruções claras para facilitar sua vida."
  },
  {
    id: 8,
    question: "É difícil de imprimir ou gasta muito material?",
    answer: "Não! Os designs foram selecionados por serem multipartes inteligentes, o que significa que o fatiador reduz ou até elimina o uso de suportes difíceis de remover. Isso poupa tempo, evita desperdício de filamento e garante um acabamento limpo e requintado digno de grife."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Ana Cláudia Martins",
    location: "Sorocaba - SP",
    role: "Martins Ateliê 3D",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120",
    text: "Eu estava extremamente frustrada. Já tinha tentado de tudo para ter uma renda extra: vendi crochê, doces gourmet e cosméticos, mas as pessoas só sabiam pedir desconto ou dizer que estava caro. Decidi arriscar nas Bolsas 3D. Quando postei a primeira foto, uma conhecida encomendou na hora por R$ 220,00! Sem pechinchar nada! Paguei o pack logo de cara e hoje vendo sem precisar ficar implorando.",
    rating: 5,
    date: "Há 3 dias"
  },
  {
    id: 2,
    name: "Roberto Silva",
    location: "Curitiba - PR",
    role: "Entusiasta de Impressão 3D",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120",
    text: "Tenho uma impressora 3D há mais de um ano e ela só acumulava poeira porque eu simplesmente não conseguia vender nada. Fabricava vasinhos, chaveiros e bonecos, mas a concorrência na internet vende isso por preço de banana. O Pack de Bolsas 3D salvou meu negócio. Hoje fabrico algo de luxo que as pessoas pagam R$ 250 rindo porque nunca viram nada igual.",
    rating: 5,
    date: "Há 1 semana"
  },
  {
    id: 3,
    name: "Camila Guimarães",
    location: "Belo Horizonte - MG",
    role: "Criadora de Acessórios",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120",
    text: "Eu tentava vender laços infantis e bijuterias, mas a concorrência é gigantesca e eu passava o mês inteiro sem vender quase nada. Com as Bolsas 3D de Luxo, as pessoas ficam chocadas quando veem nas minhas redes sociais. Não tenho concorrência na minha cidade! O produto gera desejo imediato de compra e as mulheres compram pela beleza, sem reclamar de preço.",
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
