import React, { useState, useEffect, useRef } from "react";
import { 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  ChevronRight,
  Star, 
  Award, 
  Zap, 
  Download, 
  Sparkles, 
  TrendingUp, 
  Coins, 
  Lock, 
  ShieldCheck, 
  Instagram, 
  Printer, 
  Clock, 
  Plus, 
  ArrowRight, 
  DollarSign, 
  Flame,
  CreditCard,
  QrCode,
  CheckCircle,
  Copy,
  Sliders,
  AlertCircle,
  Gem
} from "lucide-react";
import { 
  BONUSES, 
  FAQS, 
  TESTIMONIALS, 
  BAG_MODELS, 
  SIMULATED_PURCHASES,
  BagModel
} from "./data";
import WhatsAppTestimonials from "./components/WhatsAppTestimonials";
import MarketplaceCarousel from "./components/MarketplaceCarousel";
import { getOptimizedImageProps } from "./utils/image";

const formatUpsellTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function App() {
  // Video sales presentation states
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [hasVideoStarted, setHasVideoStarted] = useState(false);
  const [hasVideoEnded, setHasVideoEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Lazy load state for smartphone mockup video to speed up initial mobile loading
  const [isMockupVideoVisible, setIsMockupVideoVisible] = useState(false);
  const mockupContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsMockupVideoVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" } // trigger load slightly before it scrolls into view
    );

    if (mockupContainerRef.current) {
      observer.observe(mockupContainerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Synchronize raw video DOM muted property with React state to prevent browser-specific override issues
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleStartWithSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsMuted(false);
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play()
        .then(() => {
          setHasVideoStarted(true);
          setIsVideoPlaying(true);
          setHasVideoEnded(false);
        })
        .catch((err) => {
          console.warn("Unmuted play blocked by browser, falling back to muted play:", err);
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play()
              .then(() => {
                setHasVideoStarted(true);
                setIsVideoPlaying(true);
                setHasVideoEnded(false);
              })
              .catch((err2) => {
                console.error("Muted play also failed:", err2);
              });
          }
        });
    }
  };

  const handleReplayVideo = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.play()
        .then(() => {
          setHasVideoStarted(true);
          setIsVideoPlaying(true);
          setHasVideoEnded(false);
        })
        .catch((err) => {
          console.warn("Replay play with sound failed, trying muted replay:", err);
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play()
              .then(() => {
                setHasVideoStarted(true);
                setIsVideoPlaying(true);
                setHasVideoEnded(false);
              })
              .catch((err2) => {
                console.error("Muted replay also failed:", err2);
              });
          }
        });
    }
  };

  const handlePlayVideo = () => {
    handleStartWithSound();
  };

  const handleVideoClick = () => {
    if (!videoRef.current) return;
    
    // If video has finished, clicking should trigger replay.
    if (hasVideoEnded) {
      handleReplayVideo();
      return;
    }

    if (hasVideoStarted) {
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        videoRef.current.play()
          .then(() => {
            setIsVideoPlaying(true);
          })
          .catch((err) => {
            console.warn("Play on click failed:", err);
          });
      }
      return;
    }

    if (videoRef.current.paused) {
      videoRef.current.play()
        .then(() => {
          setIsVideoPlaying(true);
          setHasVideoStarted(true);
          setHasVideoEnded(false);
        })
        .catch((err) => {
          console.warn("Play on click failed:", err);
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play()
              .then(() => {
                setIsVideoPlaying(true);
                setHasVideoStarted(true);
                setHasVideoEnded(false);
              })
              .catch((err2) => {
                console.error("Fallback play click failed:", err2);
              });
          }
        });
    }
  };

  // Active FAQ IDs
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Selected category filter for Demo/Catalog
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState<"basico" | "completo" | "diamante">("completo");
  const [checkoutStep, setCheckoutStep] = useState<"upsell_diamond" | "payment_method" | "pix_code" | "success">("payment_method");
  const [copiedPix, setCopiedPix] = useState(false);

  // Notification Toast state (Social Proof)
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastPack, setToastPack] = useState<string>("");

  // Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 24, seconds: 45 });
  const [upsellSeconds, setUpsellSeconds] = useState(300); // 5 minutes countdown

  // Get unique categories
  const categories = ["Todos", "Bolsas Femininas", "Bolsas Modernas", "Bolsas Pequenas", "Modelos Multipartes", "Acessórios 3D"];

  // Filtered models
  const filteredModels = selectedCategory === "Todos" 
    ? BAG_MODELS 
    : BAG_MODELS.filter(m => m.category === selectedCategory);

  // Countdown timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset relative loop
          return { hours: 1, minutes: 15, seconds: 0 };
        }
      });
      setUpsellSeconds(prev => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Live social proof popups
  useEffect(() => {
    let isMounted = true;
    let timerId: NodeJS.Timeout;

    const runToastCycle = () => {
      if (!isMounted) return;
      const randomPurchase = SIMULATED_PURCHASES[Math.floor(Math.random() * SIMULATED_PURCHASES.length)];
      setToastMessage(`${randomPurchase.name} (${randomPurchase.city})`);
      setToastPack(randomPurchase.pack);
      
      // Hide after 5 seconds (5000ms)
      timerId = setTimeout(() => {
        if (!isMounted) return;
        setToastMessage(null);
        // Wait 13 seconds (13000ms) before displaying the next one
        timerId = setTimeout(runToastCycle, 13000);
      }, 5000);
    };

    // First toast appears 13 seconds after loading
    timerId = setTimeout(runToastCycle, 13000);

    return () => {
      isMounted = false;
      clearTimeout(timerId);
    };
  }, []);



  // Format countdown string
  const formatTime = (val: number) => String(val).padStart(2, "0");

  // Open simulated checkout flow
  const handleOpenCheckout = (pack: "basico" | "completo") => {
    setSelectedPack(pack);
    if (pack === "basico") {
      setCheckoutStep("upsell_diamond");
    } else {
      setCheckoutStep("payment_method");
    }
    setCopiedPix(false);
    setIsCheckoutOpen(true);
  };

  // Scroll to pricing section smoothly
  const scrollToPricing = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const element = document.getElementById("pricing");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText("00020126580014br.gov.bcb.pix0136abc12345-lucrativas-3dbags-9999");
    setCopiedPix(true);
    setTimeout(() => {
      setCheckoutStep("success");
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col items-center bg-white text-stone-900 font-sans antialiased pb-24 md:pb-8 selection:bg-[#D4AF37]/20 selection:text-stone-950">
      
      {/* 1. TOPO DE URGÊNCIA / TIMER */}
      <div className="w-full bg-stone-100 text-stone-900 py-2 px-4 text-center text-xs md:text-sm flex items-center justify-center gap-2 font-display uppercase tracking-wider font-semibold z-40 sticky top-0 border-b border-stone-200">
        <span className="text-emerald-600 font-extrabold text-xs">DESCONTO DE 84%, COMPRANDO HOJE</span>
      </div>
 
      <main className="w-full max-w-lg md:max-w-2xl lg:max-w-5xl px-4 md:px-6 pt-6 flex flex-col gap-10 md:gap-14">
        
        {/* =======================================
            SECTION 1 & 2: HEADLINE & BADGES & VIDEO
           ======================================= */}
        <section id="headline" className="text-center mt-2 flex flex-col items-center gap-2.5">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-display leading-[1.1] text-stone-900 tracking-tight text-center max-w-3xl mt-1">
            Transforme sua impressora 3D em uma{" "}
            <span className="text-[#D4AF37] relative inline-block">
              vitrine de bolsas
              <span className="absolute left-0 bottom-1 w-full h-1.5 bg-[#D4AF37]/15 rounded-full"></span>
            </span>{" "}
            prontas para vender
          </h1>
 
          <div className="w-full max-w-[440px] xs:max-w-[480px] sm:max-w-xl md:max-w-2xl mx-auto my-4 select-none">
            <img 
              {...getOptimizedImageProps("https://i.imgur.com/niXuFpj.jpeg", "h", "(max-width: 768px) 100vw, 700px")}
              alt="Vitrine de Bolsas 3D" 
              width={700}
              height={394}
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain"
            />
          </div>
 
          <p className="text-sm md:text-base text-stone-600 max-w-2xl leading-relaxed font-medium mt-3 px-4">
            Receba modelos prontos de bolsas e acessórios 3D para imprimir, divulgar e vender, sem precisar modelar absolutamente nada do zero.
          </p>
        </section>
 
        {/* =======================================
            SECTION 3: HERO ACTION CTA
           ======================================= */}
        <section id="hero-cta" className="flex flex-col gap-6">
          {/* CTA Principal da Hero */}
          <div className="flex flex-col items-center gap-2 mt-2">
            <button 
              id="cta-hero"
              onClick={(e) => scrollToPricing(e)}
              className="w-full sm:w-auto sm:px-12 py-4 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 hover:from-emerald-600 hover:to-emerald-500 active:scale-[0.98] transition-all text-black font-extrabold font-display uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/25 text-base text-center cursor-pointer flex items-center justify-center gap-2 group ring-2 ring-emerald-400/50"
            >
              <Zap className="w-5 h-5 fill-black text-black animate-pulse" />
              QUERO ACESSAR OS MODELOS AGORA
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-black" />
            </button>
            
            {/* Microcopy de confiança */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] md:text-xs text-stone-500 mt-1 font-medium">
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <Check className="w-4.5 h-4.5" /> Acesso imediato
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-4.5 h-4.5 text-[#AA7C11]" /> Arquivos vitalícios
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-4.5 h-4.5 text-[#AA7C11]" /> Permissão comercial inclusa
              </span>
            </div>
          </div>
        </section>
 
 
 
        {/* =======================================
            SECTION 4 & 5: MARKETPLACES BESTSELLERS
           ======================================= */}
        <section id="mais-vendidos-marketplaces" className="flex flex-col gap-6 w-full py-6 text-center">
          <div className="max-w-2xl mx-auto flex flex-col gap-1.5 px-4">
            <span className="text-xs font-mono uppercase text-[#AA7C11] font-bold tracking-wider">Alta Lucratividade</span>
            <h2 className="text-lg md:text-xl font-bold font-display text-stone-900 leading-tight uppercase">
              Os Modelos 3D Mais Vendidos e Desejados do Mercado
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Descubra as bolsas de grife 3D com maior volume de buscas, sucesso absoluto de vendas e altíssima margem de lucro.
            </p>
          </div>
 
          <MarketplaceCarousel />
        </section>
 
        {/* =======================================
            SECTION 8: PROVAS E VALIDAÇÃO (SOCIAL PROOF)
           ======================================= */}
        <section id="provas" className="w-full">
          <WhatsAppTestimonials />
        </section>
 
        {/* =======================================
            SECTION 8.5: ÁREA DE MEMBROS EXCLUSIVA (MEMBERS AREA)
           ======================================= */}
        <section id="area-de-membros" className="bg-stone-50 text-stone-900 rounded-3xl p-6 md:p-10 border border-stone-200 shadow-xl flex flex-col gap-8 w-full relative overflow-hidden">
          {/* Subtle background glow effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
 
          <div className="text-center max-w-2xl mx-auto flex flex-col items-center z-10">
            <span className="text-xs font-mono uppercase text-[#AA7C11] font-extrabold tracking-widest bg-[#D4AF37]/10 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/20">
              Plataforma VIP de Alunos
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold font-display text-stone-900 mt-4 leading-tight uppercase tracking-tight">
              ÁREA DE MEMBROS EXCLUSIVA & ORGANIZADA
            </h2>
            <p className="text-sm text-stone-600 mt-2 font-medium leading-relaxed max-w-lg">
              Veja por dentro como funciona o nosso portal de alunos. Uma experiência premium com acesso imediato e vitalício para você começar a faturar hoje!
            </p>
          </div>

          <div className="flex flex-col items-center justify-center w-full z-10">
            {/* Video Column */}
            <div className="flex flex-col items-center justify-center w-full">
              {/* Sleek Modern High-Fidelity Smartphone Mockup Frame in standard 9:16 Aspect Ratio with an Elegant Gold / Champagne finish */}
              <div ref={mockupContainerRef} className="relative mx-auto w-full max-w-[290px] sm:max-w-[310px] aspect-[9/16] bg-gradient-to-b from-[#FFF3B0] via-[#D4AF37] to-[#AA7C11] rounded-[36px] p-[5px] shadow-[0_25px_60px_-15px_rgba(212,175,55,0.35),0_0_40px_rgba(212,175,55,0.25),inset_0_0_12px_rgba(255,255,255,0.9)] border-[5px] border-[#D4AF37] ring-4 ring-[#FFF3B0]/60 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_30px_70px_-10px_rgba(212,175,55,0.45)]">
                
                {/* Screen Reflection Accent removed to keep the video extremely clear, with no glare or reflection */}
                
                {/* Display Container with Slim Uniform Bezel */}
                <div className="relative w-full h-full rounded-[30px] p-[2.5px] bg-black z-20 border border-[#D4AF37]/30 shadow-inner flex flex-col overflow-hidden isolate">
                  
                  {/* Subtle Speaker Grill Line */}
                  <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 h-1 w-12 bg-stone-900 rounded-full z-40" />
 
                  {/* Absolute Full Screen Display Container */}
                  <div className="relative w-full h-full rounded-[27px] overflow-hidden bg-black z-20 shadow-inner flex-1 flex flex-col isolate">
                    {isMockupVideoVisible ? (
                      <video 
                        src="https://i.imgur.com/vBV9KeN.mp4" 
                        autoPlay
                        muted
                        loop
                        playsInline
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain bg-black flex-1 rounded-[27px] pointer-events-none select-none"
                      />
                    ) : (
                      <div className="w-full h-full bg-black flex-1 rounded-[27px] flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

          {/* =======================================
              SECTION 13: BÔNUS
             ======================================= */}
        <section id="bonus" className="bg-stone-50 rounded-2xl p-4 sm:p-5 md:p-8 border border-stone-200 shadow-sm flex flex-col gap-5 w-full">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[10px] sm:text-xs font-mono uppercase text-[#AA7C11] font-extrabold tracking-wider bg-[#D4AF37]/10 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/20">
              Bônus Exclusivos
            </span>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black font-display text-stone-900 mt-2 leading-snug">
              BÔNUS INCLUSOS NO SEU ACESSO HOJE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                id: 1,
                title: "PACK DE JOIAS E ACESSÓRIOS 3D",
                description: "Arquivos de brincos, anéis, pingentes e pulseiras de alto padrão prontos para imprimir e vender.",
                originalPrice: "R$ 49,90",
                image: "https://i.imgur.com/cjEBr2k.png"
              },
              {
                id: 4,
                title: "ALÇAS PERSONALIZADAS",
                description: "Matrizes de alças exclusivas e texturizadas, desenhadas para elevar e valorizar o design das suas bolsas.",
                originalPrice: "R$ 67,00",
                image: "https://i.imgur.com/mpg977d.png"
              },
              {
                id: 5,
                title: "GUIA COMPLETO DE FATIAMENTO",
                description: "As melhores configurações e filamentos (PLA Silk, TPU, Flex) para criar bolsas perfeitas.",
                originalPrice: "R$ 49,90",
                image: "https://i.imgur.com/S8vmXmm.png"
              },
              {
                id: 6,
                title: "CANECA E PORTA-COPOS PREMIUM",
                description: "Modelos modernos e decorativos de copos, canecas e suportes criativos de alta tendência.",
                originalPrice: "R$ 49,90",
                image: "https://i.imgur.com/jvClJDK.png"
              },
              {
                id: 7,
                title: "KIT STL ANÉIS DE LUXO",
                description: "Arquivos de anéis sofisticados com anatomia moderna e alto apelo comercial.",
                originalPrice: "R$ 59,90",
                image: "https://i.imgur.com/3YdHSTu.png"
              },
              {
                id: 8,
                title: "HARMONIA E COMBINAÇÃO DE CORES",
                description: "Guia prático para combinar cores de filamentos e valorizar ainda mais o design das suas peças.",
                originalPrice: "R$ 39,90",
                image: "https://i.imgur.com/yB5Qpp7.png"
              }
            ].map((bonus) => (
              <div 
                key={bonus.id} 
                className="flex flex-row gap-3.5 p-3 bg-white hover:bg-stone-50 rounded-xl border border-stone-200 hover:border-[#D4AF37]/50 shadow-xs transition-all duration-300 text-left items-center group relative overflow-hidden"
              >
                {/* Image Section */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-stone-100 rounded-lg border border-stone-200 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs relative">
                  <img 
                    {...getOptimizedImageProps(bonus.image, "l", "(max-width: 640px) 100vw, 112px")}
                    alt={bonus.title} 
                    loading="lazy"
                    decoding="async"
                    width={112}
                    height={112}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Content Section */}
                <div className="flex flex-col gap-1 flex-1 justify-center min-w-0">
                  <h3 className="font-extrabold text-stone-900 text-xs sm:text-xs font-display leading-tight uppercase tracking-tight truncate sm:whitespace-normal">
                    {bonus.title}
                  </h3>
                  <p className="text-[11px] text-stone-600 leading-tight font-medium line-clamp-3 sm:line-clamp-none">
                    {bonus.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Closing copy */}
          <div className="mt-1 p-3 bg-stone-100 border border-stone-200 rounded-xl text-center max-w-md mx-auto shadow-3xs">
            <p className="text-[11px] text-stone-700 leading-normal font-bold">
              “Todos esses bônus são adicionados ao seu acesso imediatamente, sem nenhum custo extra.”
            </p>
          </div>
        </section>

        {/* =======================================
            SECTION 11: OPORTUNIDADE E LUCRATIVIDADE (REPLACED WITH COMPARISON INFOGRAPHIC)
           ======================================= */}
        <section id="comparacao" className="flex flex-col items-center gap-6 w-full">
          <div className="relative rounded-3xl p-[3px] bg-gradient-to-br from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] shadow-2xl shadow-[#D4AF37]/20 w-full max-w-4xl mx-auto">
            <div className="rounded-[22px] overflow-hidden bg-black">
              <img 
                {...getOptimizedImageProps("https://i.imgur.com/ASxkKxL.png", "h", "(max-width: 1024px) 100vw, 896px")}
                alt="Comparação de Lucratividade" 
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                width={896}
                height={560}
                className="w-full h-auto block object-cover"
              />
            </div>
          </div>
        </section>

        {/* =======================================
            SECTION 10: DEMONSTRAÇÃO VISUAL (CATALOGO DE IMAGENS)
           ======================================= */}
        <section id="demonstracao-visual" className="flex flex-col gap-5 bg-gradient-to-b from-stone-50 via-stone-100 to-stone-50 px-3.5 py-6 sm:p-6 md:p-8 rounded-3xl border border-stone-200 shadow-inner w-full overflow-hidden">
          <div className="text-center max-w-xl mx-auto flex flex-col items-center w-full px-2">
            <div className="bg-[#D4AF37]/10 p-2.5 rounded-full shadow-xs mb-3 flex items-center justify-center border border-[#D4AF37]/20">
              <Gem className="w-5 h-5 text-[#D4AF37] animate-pulse" />
            </div>
            <span className="text-[10px] xs:text-xs font-mono uppercase text-[#AA7C11] font-extrabold tracking-widest text-center">Variedade Inclusa</span>
            <h2 className="text-lg xs:text-xl md:text-2xl font-black font-display text-stone-900 mt-1.5 uppercase text-center tracking-tight break-words px-1 leading-tight">
              COLEÇÃO DE MODELOS 3D
            </h2>
          </div>


          {/* Catalog Grid of Images with beautiful diamond styled cards (Dynamically Filtered) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 max-w-5xl mx-auto w-full">
            {[
              { url: "https://i.imgur.com/DnuaZYa.webp", category: "Bolsas Femininas" },
              { url: "https://i.imgur.com/kA3oDNb.webp", category: "Bolsas Modernas" },
              { url: "https://i.imgur.com/ucxS8av.webp", category: "Bolsas Pequenas" },
              { url: "https://i.imgur.com/owlo85R.webp", category: "Bolsas Femininas" },
              { url: "https://i.imgur.com/1ZrOAYg.webp", category: "Bolsas Modernas" },
              { url: "https://i.imgur.com/0OYGdYF.webp", category: "Modelos Multipartes" },
              { url: "https://i.imgur.com/UlVdHnP.webp", category: "Bolsas Modernas" },
              { url: "https://i.imgur.com/WpXschZ.webp", category: "Bolsas Femininas" },
              { url: "https://i.imgur.com/jHAsRHH.webp", category: "Bolsas Pequenas" },
              { url: "https://i.imgur.com/anSVxa9.webp", category: "Bolsas Femininas" },
              { url: "https://i.imgur.com/xoF6qS6.webp", category: "Acessórios 3D" },
              { url: "https://i.imgur.com/rZY2UF7.webp", category: "Acessórios 3D" },
              { url: "https://i.imgur.com/cjuNzSh.webp", category: "Acessórios 3D" },
              { url: "https://i.imgur.com/r0cHyEm.webp", category: "Modelos Multipartes" },
              { url: "https://i.imgur.com/bQrYZiv.webp", category: "Bolsas Pequenas" },
              { url: "https://i.imgur.com/LMSAGTN.webp", category: "Modelos Multipartes" }
            ]
              .filter((item) => selectedCategory === "Todos" || item.category === selectedCategory)
              .map((item, index) => (
                <div 
                  key={index} 
                  className="group relative aspect-square bg-white rounded-2xl shadow-md border border-stone-250 transition-all duration-500 hover:scale-[1.04] hover:shadow-[#D4AF37]/15 hover:shadow-xl hover:border-[#D4AF37]/40 p-1 bg-gradient-to-tr from-stone-100 via-white to-stone-100"
                >
                  <div className="relative w-full h-full bg-white rounded-xl overflow-hidden flex items-center justify-center">
                    {/* High luxury reflection overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
 
                    {/* Zooming Cover Image */}
                    <img 
                      {...getOptimizedImageProps(item.url, "l", "(max-width: 640px) 50vw, 240px")}
                      alt={`Modelo exclusive ${index + 1}`} 
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                      width={240}
                      height={240}
                      className="w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Hover Overlay with text */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-900/95 via-stone-900/70 to-transparent p-1.5 sm:p-2 text-center transition-all duration-300 transform translate-y-1.5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 z-10">
                      <span className="text-[8px] sm:text-[9.5px] font-mono tracking-normal sm:tracking-wider text-[#D4AF37] font-extrabold uppercase flex items-center justify-center gap-1 flex-wrap px-1 leading-tight">
                        <Gem className="w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0 text-[#D4AF37] animate-bounce" />
                        Acabamento Diamante
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="bg-stone-100 rounded-2xl p-4 border border-stone-200 text-center max-w-xl mx-auto shadow-xs">
            <p className="text-xs text-stone-600 leading-relaxed font-medium">
              *Quanto mais modelos você tem no seu catálogo digital, mais possibilidades e nichos de mercado você consegue divulgar, testar e vender sem custos de modelagem.
            </p>
          </div>
        </section>

        {/* =======================================
            SECTION 12: PLANOS & PREÇOS (PRICING)
           ======================================= */}
        <section id="pricing" className="flex flex-col gap-5">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-mono uppercase text-[#AA7C11] font-bold">Planos Disponíveis</span>
            <h2 className="text-lg md:text-xl font-bold font-display text-stone-900 mt-1">
              Escolha o pack ideal para começar hoje
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Escolha a opção perfeita para o seu momento. O acesso é liberado em menos de 1 minuto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
            {/* CARD 1: PACK BÁSICO */}
            <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 flex flex-col gap-3.5 relative shadow-sm text-left md:self-start">
              <div className="flex flex-col gap-2.5">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-mono tracking-widest text-stone-500 font-bold uppercase">Pacote Inicial</span>
                  <h3 className="text-base font-extrabold font-display text-stone-900">PACK BÁSICO</h3>
                  <p className="text-xs text-stone-600">
                    Ideal para dar os primeiros passos e testar a lucratividade das bolsas 3D.
                  </p>
                </div>

                {/* Preço */}
                <div className="py-2.5 border-t border-b border-stone-200 flex flex-col bg-stone-100 -mx-4 px-4 my-0.5">
                  <span className="text-[9px] text-[#AA7C11] uppercase font-extrabold tracking-wider">Oferta de Entrada</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xs text-stone-900 font-extrabold">R$</span>
                    <span className="text-3xl font-black text-stone-900 font-display tracking-tight">10,90</span>
                    <span className="text-[11px] text-stone-600 font-bold ml-1">único / à vista</span>
                  </div>
                  <span className="text-[9px] text-emerald-600 font-extrabold mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    ✓ Sem taxas ou mensalidades adicionais
                  </span>
                </div>

                {/* Itens Inclusos */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wider">Itens Inclusos:</span>
                  {[
                    "70 modelos selecionados a dedo",
                    "Licença comercial para venda física",
                    "Sem os demais Bônus",
                    "Acesso vitalício aos arquivos STL",
                    "Download 100% imediato"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#AA7C11] shrink-0 mt-0.5" />
                      <span className="text-xs text-stone-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => {
                  handleOpenCheckout("basico");
                }}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-extrabold font-display uppercase tracking-wider rounded-xl transition-all cursor-pointer text-xs text-center shadow-sm active:scale-[0.98]"
              >
                COMEÇAR COM O PLANO BÁSICO
              </button>
            </div>

            {/* CARD 2: CENTRAL DE BOLSAS PREMIUM */}
            <div className="relative rounded-2xl p-[3px] bg-gradient-to-br from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] shadow-2xl shadow-[#D4AF37]/20 scale-100 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-[#D4AF37]/35">
              <div className="bg-white text-stone-800 rounded-[14px] p-5 flex flex-col justify-between gap-5 h-full relative text-left">
                <div className="absolute -top-4 bg-gradient-to-r from-[#D4AF37] to-[#FFF3B0] text-black text-xs sm:text-sm font-black uppercase py-2 px-6 rounded-full tracking-widest shadow-xl border-2 border-white/40 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-10 whitespace-nowrap scale-105">
                  <Sparkles className="w-4 h-4 text-black fill-black" />
                  O MAIS ESCOLHIDO
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-0.5 mt-2 text-center">
                    <h3 className="text-xl sm:text-2xl font-black font-display text-stone-900 tracking-tight uppercase leading-tight">CENTRAL DE BOLSAS PREMIUM</h3>
                  </div>

                  {/* Image placed on top, without borders */}
                  <div className="relative mb-3 mt-2 flex justify-center overflow-visible">
                    <img 
                      {...getOptimizedImageProps("https://i.imgur.com/fQfT8Uf.png", "h", "(max-width: 640px) 100vw, 400px")}
                      alt="Central de Bolsas Premium" 
                      referrerPolicy="no-referrer"
                      loading="eager"
                      fetchPriority="high"
                      width={380}
                      height={250}
                      className="w-[85%] sm:w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] h-auto block object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.08)]"
                    />
                  </div>

                  {/* Preço */}
                  <div className="py-3 border-t border-b border-stone-200 flex flex-col">
                    <span className="text-[9px] text-amber-700 uppercase font-black tracking-wider">Desconto de lançamento</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-sm text-stone-500 font-black">R$</span>
                      <span className="text-4xl sm:text-5xl font-black text-stone-950 font-display tracking-tight">19,90</span>
                      <span className="text-xs text-stone-500 font-bold ml-1">ou até em 5x</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-black mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      ✓ Acesso vitalício e sem assinaturas
                    </span>
                  </div>

                  {/* Itens Inclusos */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">O que você vai receber:</span>
                    {[
                      "Mais de 70 modelos de bolsas e acessórios",
                      "Licença comercial vitalícia inclusa",
                      "Bônus: Pack de Joias e Acessórios 3D",
                      "Bônus: Alças Personalizadas",
                      "Bônus: Guia Completo de Fatiamento",
                      "Bônus: Caneca e Porta-Copos Premium",
                      "Bônus: Kit STL Anéis de Luxo",
                      "Bônus: Harmonia e Combinação de Cores",
                      "Atualizações futuras 100% gratuitas",
                      "Suporte individual no WhatsApp",
                      "Download 100% imediato"
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-stone-800 font-semibold">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    window.location.href = "https://ggcheckout.app/checkout/v5/sGcFhzWO0zFmnQWdnK5h";
                  }}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 hover:from-emerald-600 hover:to-emerald-500 text-black font-black font-display uppercase tracking-widest rounded-xl transition-all cursor-pointer text-xs sm:text-sm text-center shadow-lg shadow-emerald-500/25 active:scale-[0.98] ring-2 ring-emerald-400/50"
                >
                  QUERO A CENTRAL COMPLETA
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =======================================
            SECTION 15: GARANTIA & SEGURANÇA
           ======================================= */}
        <section id="garantia" className="bg-stone-50 rounded-2xl p-5 border border-stone-200 shadow-sm max-w-xl mx-auto flex items-center gap-4 text-left">
          <img 
            {...getOptimizedImageProps("https://i.imgur.com/8srQFdp.png", "l", "80px")}
            alt="Garantia de 7 dias" 
            width={80}
            height={80}
            className="w-16 sm:w-20 h-auto shrink-0 object-contain"
            referrerPolicy="no-referrer"
          />

          <div className="flex flex-col gap-1">
            <h3 className="text-xs md:text-sm font-bold font-display text-stone-900 leading-tight">
              Acesso imediato & Garantia incondicional de 7 dias
            </h3>
            <p className="text-[10px] md:text-xs text-stone-600 leading-relaxed">
              Você recebe na hora o acesso digital para baixar todos os arquivos organizados. Caso mude de ideia, garantimos reembolso total em até 7 dias sem qualquer complicação!
            </p>
          </div>
        </section>

        {/* =======================================
            SECTION 16: FAQ (ACCORDION)
           ======================================= */}
        <section id="faq" className="flex flex-col gap-6">
          <div className="text-center max-w-2xl mx-auto flex flex-col items-center">
            <span className="text-xs font-mono uppercase text-[#AA7C11] font-bold bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/20">Dúvidas Frequentes</span>
            <h2 className="text-xl md:text-2xl font-bold font-display text-stone-900 mt-3">
              Perguntas frequentes sobre o pack de bolsas
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Ainda com dúvidas? Veja as respostas para as principais dúvidas dos clientes abaixo.
            </p>
          </div>

          <div className="flex flex-col gap-3 max-w-2xl mx-auto w-full">
            {FAQS.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className="bg-stone-50 rounded-xl border border-stone-200 shadow-sm overflow-hidden transition-all text-left"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full p-4 flex justify-between items-center gap-3 font-semibold text-xs md:text-sm text-stone-900 hover:bg-stone-100 transition-colors text-left font-display cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen 
                      ? <ChevronUp className="w-4 h-4 text-[#AA7C11] shrink-0" /> 
                      : <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                    }
                  </button>

                  <div 
                    className={`transition-all duration-300 ${
                      isOpen ? "max-h-60 opacity-100 border-t border-stone-200 p-4" : "max-h-0 opacity-0 pointer-events-none"
                    }`}
                  >
                    <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =======================================
            SECTION 17: CTA FINAL
           ======================================= */}
        <section id="cta-final" className="text-center bg-[#D4AF37]/5 p-6 md:p-8 rounded-2xl border border-[#D4AF37]/20 flex flex-col items-center gap-4">
          <h2 className="text-xl md:text-2xl font-bold font-display text-stone-900 max-w-xl leading-tight">
            Você pode continuar imprimindo o comum… ou começar a mostrar peças que fazem as pessoas pararem para olhar
          </h2>
          
          <p className="text-xs md:text-sm text-stone-600 max-w-lg leading-relaxed">
            O Pack Bolsas 3D Lucrativas foi desenvolvido estrategicamente para quem deseja transformar sua impressora 3D comum em uma verdadeira vitrine geradora de orçamentos e vendas de alto valor agregado.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2">
            <button 
              onClick={(e) => scrollToPricing(e)}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 hover:from-emerald-600 hover:to-emerald-500 text-black font-extrabold font-display text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-1.5 ring-2 ring-emerald-400/50"
            >
              <Sparkles className="w-4 h-4 text-black fill-black" />
              QUERO A CENTRAL COMPLETA
            </button>
            
            <button 
              onClick={(e) => scrollToPricing(e)}
              className="px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-extrabold font-display text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
            >
              COMEÇAR COM O BÁSICO
            </button>
          </div>

          <div className="flex flex-col gap-1 text-[10px] text-stone-500 mt-2 font-medium">
            <span>⏱️ Preço promocional disponível por tempo estritamente limitado.</span>
            <span>🔒 Transação assegurada e criptografada com segurança de ponta.</span>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="text-center text-[10px] text-stone-500 mt-6 pt-6 border-t border-stone-200 flex flex-col gap-1.5">
          <p className="font-semibold text-stone-500">Pack Bolsas 3D Lucrativas • Todos os direitos reservados © 2026</p>
          <p className="max-w-md mx-auto leading-relaxed text-[9px] text-stone-400">
            Aviso de responsabilidade: Os resultados financeiros exibidos neste site são simulações de potencial e dependem exclusivamente da qualidade de sua fabricação física, preços locais, margem de filamento e competência na divulgação.
          </p>
        </footer>

      </main>

      {/* MOBILE FIXED FOOTER BAR REMOVED */}

      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className={`bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative text-left transition-all ${checkoutStep === "upsell_diamond" ? "border-4 border-[#e11d48]" : "border border-stone-200/90"}`}>
            
            {/* Botão de Fechar */}
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-3.5 right-3.5 text-stone-400 hover:text-stone-900 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center cursor-pointer border border-stone-200 transition-colors z-50"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Cabeçalho do Checkout */}
            {checkoutStep !== "upsell_diamond" && (
              <div className="bg-stone-50 text-stone-900 p-5 pr-12 flex items-center gap-3 border-b border-stone-200">
                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-[#AA7C11] shrink-0 border border-stone-200">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#AA7C11] font-mono uppercase font-bold tracking-wider">Ambiente de Compra Seguro</span>
                  <h3 className="text-base font-bold font-display leading-tight text-stone-900">
                    {selectedPack === "basico" 
                      ? "Finalizar Pack Básico" 
                      : selectedPack === "diamante" 
                      ? "Finalizar Plano Diamante" 
                      : "Finalizar Central de Bolsas Premium"}
                  </h3>
                </div>
              </div>
            )}

            {/* Conteúdo do Checkout com base no passo */}
            <div className="p-5 flex flex-col gap-4">

              {/* PASSO DE UPSELL: Plano Diamante */}
              {checkoutStep === "upsell_diamond" && (
                <div className="flex flex-col gap-5 animate-fade-in py-1">
                  
                  {/* Alert Header */}
                  <div className="bg-[#e11d48]/10 text-[#e11d48] border border-[#e11d48]/25 rounded-xl p-3 text-center flex items-center justify-center gap-1.5 shadow-sm">
                    <span className="text-[13px] font-black uppercase tracking-tight flex items-center gap-1">
                      🔴 ESPERA! NÃO LEVE APENAS O BÁSICO!
                    </span>
                  </div>

                  {/* Header Subtitles */}
                  <div className="text-center flex flex-col gap-1.5">
                    <div className="inline-block self-center bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                      OPORTUNIDADE VIP LIBERADA
                    </div>
                    <p className="text-stone-900 font-extrabold text-sm tracking-tight mt-1">
                      Você acabou de desbloquear um upgrade exclusivo!
                    </p>
                  </div>

                  {/* Pack Highlights Area (Fundo Branco, Borda Vermelha) */}
                  <div className="bg-stone-50 border-2 border-dashed border-[#e11d48]/30 rounded-2xl p-5 text-center flex flex-col gap-3 shadow-inner">
                    <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                      Leve agora o acesso ao:
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black text-stone-950 font-display tracking-tight uppercase leading-tight">
                      PACK PREMIUM +70 BOLSAS 3D
                    </h4>
                    <p className="text-xs text-stone-600 font-semibold leading-relaxed max-w-xs mx-auto">
                      e receba ainda mais modelos exclusivos para imprimir e vender.
                    </p>
                  </div>

                  {/* Pricing Box */}
                  <div className="flex flex-col items-center justify-center bg-stone-50 border border-stone-200/80 rounded-2xl p-4 shadow-sm text-center">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                        Preço anterior (riscado):
                      </span>
                      <span className="text-stone-400 font-bold text-base line-through tracking-tight mt-0.5">
                        R$ 24,90
                      </span>
                    </div>

                    <div className="w-full h-[1px] bg-stone-200/80 my-3" />

                    <div className="flex flex-col items-center justify-center">
                      <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 mb-1">
                        PREÇO ATUAL:
                      </span>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-stone-900 font-black text-xl">R$</span>
                        <span className="text-4xl font-black text-stone-900 tracking-tighter font-display leading-none">
                          14,90
                        </span>
                      </div>
                    </div>

                    {/* Timer Countdown */}
                    <div className="mt-3.5 flex items-center justify-center gap-1.5 text-[10px] font-mono text-red-600 font-extrabold uppercase tracking-wider bg-red-50/80 border border-red-100 px-3 py-1 rounded-full animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                      A oferta expira em: {formatUpsellTime(upsellSeconds)}
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col gap-2 w-full mt-1">
                    {/* Botão de Upgrade */}
                    <button
                      onClick={() => {
                        window.location.href = "https://ggcheckout.app/checkout/v5/nlQGFSmIdG30ilfRquS5";
                      }}
                      className="w-full py-4.5 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer text-center flex items-center justify-center gap-2 border-b-4 border-emerald-700 animate-pulse"
                    >
                      <span className="flex items-center gap-2 font-black text-white">
                        <Sparkles className="w-4.5 h-4.5 text-white fill-white" />
                        SIM! QUERO O PACK PREMIUM POR R$ 14,90
                      </span>
                    </button>

                    {/* Botão para manter o básico */}
                    <button
                      onClick={() => {
                        window.location.href = "https://ggcheckout.app/checkout/v5/DlZTUavFROZtgejVqW41";
                      }}
                      className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center shadow-md shadow-red-500/10 hover:scale-[1.01] active:scale-[0.99] border-b-4 border-red-800"
                    >
                      NÃO, QUERO FICAR APENAS COM O PLANO BÁSICO (R$ 10,90)
                    </button>
                  </div>
                </div>
              )}

              {/* PASSO 1: Selecionar método de pagamento */}
              {checkoutStep === "payment_method" && (
                <div className="flex flex-col gap-4 animate-fade-in text-stone-800">
                  <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 flex justify-between items-center">
                    <span className="text-xs font-semibold text-stone-500">Pacote Escolhido:</span>
                    <span className="text-xs font-bold text-[#AA7C11] font-mono">
                      {selectedPack === "basico" 
                        ? "BÁSICO (R$ 10,90)" 
                        : selectedPack === "diamante" 
                        ? "PLANO DIAMANTE (R$ 14,90)" 
                        : "CENTRAL DE BOLSAS PREMIUM (R$ 19,90)"}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 text-center leading-relaxed">
                    Selecione abaixo a forma fictícia de pagamento para simular a conclusão de compra imediatamente:
                  </p>

                  <div className="flex flex-col gap-2">
                    {/* Botão PIX */}
                    <button 
                      onClick={() => setCheckoutStep("pix_code")}
                      className="w-full p-4 border-2 border-emerald-500 bg-emerald-50/5 hover:bg-emerald-50/10 rounded-xl flex items-center justify-between transition-colors cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <QrCode className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-stone-900 group-hover:text-emerald-600 transition-colors">Pagar com PIX</span>
                          <span className="text-[10px] text-stone-500">Liberação e download 100% instantâneos</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Botão Cartão */}
                    <button 
                      onClick={() => setCheckoutStep("success")}
                      className="w-full p-4 border border-stone-200 bg-stone-50 hover:bg-stone-100 rounded-xl flex items-center justify-between transition-colors cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-stone-800">Pagar com Cartão</span>
                          <span className="text-[10px] text-stone-500">Crédito imediato em até 12x</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-400" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-500 mt-2">
                    <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                    <span>Seus dados simulados estão 100% protegidos e seguros.</span>
                  </div>
                </div>
              )}

              {/* PASSO 2: Código PIX */}
              {checkoutStep === "pix_code" && (
                <div className="flex flex-col items-center gap-4 text-center animate-fade-in text-stone-800">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 animate-pulse border border-emerald-200">
                    <QrCode className="w-6 h-6" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <h4 className="font-bold text-stone-900 text-sm">Escaneie ou copie a chave PIX</h4>
                    <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                      Para simular o pagamento, copie a chave pix abaixo ou espere o cronômetro para aprovar automaticamente.
                    </p>
                  </div>

                  {/* QRCode Fictício */}
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <div className="w-36 h-36 bg-white flex flex-col items-center justify-center border border-dashed border-stone-250 relative">
                      <QrCode className="w-16 h-16 text-stone-300" />
                      <span className="text-[8px] font-mono font-bold text-stone-400 absolute bottom-2">MOCK QRCODE</span>
                    </div>
                  </div>

                  {/* Pix Copy and Paste Button */}
                  <div className="w-full flex flex-col gap-2">
                    <button
                      onClick={copyPixKey}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
                    >
                      {copiedPix ? (
                        <>
                          <CheckCircle className="w-4.5 h-4.5 text-white" />
                          PIX Copiado! Simulando aprovação...
                        </>
                      ) : (
                        <>
                          <Copy className="w-4.5 h-4.5" />
                          COPIAR CÓDIGO PIX COPIA E COLA
                        </>
                      )}
                    </button>
                    <p className="text-[9px] text-stone-500">
                      *Após clicar em copiar, o simulador avançará automaticamente para o painel de entrega de arquivos!
                    </p>
                  </div>
                </div>
              )}

              {/* PASSO 3: Sucesso de Compra e download */}
              {checkoutStep === "success" && (
                <div className="flex flex-col items-center gap-4 text-center animate-fade-in text-stone-800">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <CheckCircle className="w-8 h-8" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <h4 className="font-bold text-stone-900 text-base">Pagamento Aprovado com Sucesso! 🎉</h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Seu pagamento simulado foi processado. Você acabou de garantir acesso vitalício e ilimitado ao pack!
                    </p>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl w-full text-left text-xs text-stone-700 leading-snug">
                    <span className="font-bold text-emerald-600 block mb-1">📦 Informações de Acesso Simuladas:</span>
                    <div>• <strong>Área de membros:</strong> link enviado no seu e-mail</div>
                    <div>• <strong>Acesso:</strong> joao.freitas.ads@gmail.com</div>
                    <div>• <strong>Quantidade:</strong> {selectedPack === "basico" ? "70 arquivos selecionados" : selectedPack === "diamante" ? "Plano Diamante com todos os 70+ arquivos + bônus vitalícios!" : "Mais de 70 arquivos + todos os bônus desbloqueados!"}</div>
                  </div>

                  <div className="w-full flex flex-col gap-2.5">
                    {/* Botão de download simulado */}
                    <a
                      href="data:text/plain;charset=utf-8,Parabéns%20pelo%20Pack%20Bolsas%203D%20Lucrativas!%20Seu%20acesso%20completo%20foi%20liberado."
                      download="Acesso_Pack_Bolsas_3D_Lucrativas.txt"
                      className="w-full py-3 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] hover:from-[#AA7C11] hover:to-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 cursor-pointer text-center shadow-md"
                    >
                      <Download className="w-4 h-4 text-black" />
                      BAIXAR GUIA DE BOAS-VINDAS (PDF SIMULADO)
                    </a>
                    
                    <button
                      onClick={() => setIsCheckoutOpen(false)}
                      className="text-xs text-stone-500 underline hover:text-stone-800 cursor-pointer"
                    >
                      Voltar para a página de vendas
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* =======================================
          SOCIAL PROOF LIVE TOAST POPUP (Toast)
         ======================================= */}
      {toastMessage && (
        <div className="fixed bottom-16 sm:bottom-6 left-6 z-40 bg-stone-950 border-2 border-[#D4AF37] rounded-xl p-4 shadow-2xl flex items-center gap-3.5 max-w-[320px] animate-fade-in-up text-white">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center shrink-0 text-lg shadow-xs">
            🎉
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-black text-white leading-tight">
              {toastMessage}
            </span>
            <span className="text-xs text-stone-300 font-semibold mt-0.5 leading-normal">
              adquiriu a{" "}
              <span className="text-[#D4AF37] font-extrabold underline decoration-[#D4AF37]/20">
                Central Completa
              </span>
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
