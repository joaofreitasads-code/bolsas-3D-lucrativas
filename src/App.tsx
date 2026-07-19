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
  FolderKanban, 
  Clock, 
  Smartphone, 
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
import ImageCarousel from "./components/ImageCarousel";
import WhatsAppTestimonials from "./components/WhatsAppTestimonials";
import MarketplaceCarousel from "./components/MarketplaceCarousel";
import { getOptimizedImageProps } from "./utils/image";

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
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col items-center bg-[#F8F6F3] text-[#1B1B1B] font-sans antialiased pb-24 md:pb-8 selection:bg-[#B45F4D]/20 selection:text-[#B45F4D]">
      
      {/* 1. TOPO DE URGÊNCIA / TIMER */}
      <div className="w-full bg-[#111111] text-[#F8F6F3] py-2 px-4 text-center text-xs md:text-sm flex items-center justify-center gap-2 font-display uppercase tracking-wider font-semibold z-40 sticky top-0 border-b border-[#B45F4D]/20">
        <span className="text-emerald-400 font-extrabold text-xs">DESCONTO DE 84%, COMPRANDO HOJE</span>
      </div>

      <main className="w-full max-w-lg md:max-w-2xl lg:max-w-5xl px-4 md:px-6 pt-6 flex flex-col gap-10 md:gap-14">
               {/* =======================================
            SECTION 1 & 2: HEADLINE & BADGES & VIDEO
           ======================================= */}
        <section id="headline" className="text-center mt-2 flex flex-col items-center gap-2.5">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-display leading-[1.15] text-stone-900 tracking-tight text-center max-w-5xl mt-1">
            Cansada de fabricar peças que todos acham "bonitinhas" mas{" "}
            <span className="text-[#B45F4D] relative inline-block">
              ninguém quer pagar
              <span className="absolute left-0 bottom-1 w-full h-1.5 bg-[#B45F4D]/15 rounded-full"></span>
            </span>{" "}
            o valor justo? Descubra como Bolsas 3D de Grife são vendidas por <span className="text-emerald-600">R$ 180 a R$ 350 cada</span>, com desejo incontrolável das clientes!
          </h1>

          <div className="relative w-full rounded-2xl overflow-hidden mt-1" onContextMenu={(e) => e.preventDefault()}>
            {/* Sales video player with smooth styling - 9:16 Portrait Ratio, optimized to be sleeker on mobile */}
            <div className="relative w-full max-w-[260px] xs:max-w-[290px] sm:max-w-sm mx-auto overflow-hidden bg-black rounded-2xl aspect-[9/16] border-4 border-[#B45F4D]/80 ring-8 ring-[#B45F4D]/10 shadow-[0_10px_40px_-10px_rgba(180,95,77,0.3)] group">
              <video 
                ref={videoRef}
                autoPlay={false}
                preload="auto"
                muted={isMuted}
                loop={false}
                controls={false}
                controlsList="nodownload nofullscreen noremoteplayback"
                disablePictureInPicture
                disableRemotePlayback
                playsInline
                webkit-playsinline="true"
                x5-playsinline="true"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-2xl bg-black pointer-events-none outline-hidden active:outline-hidden focus:outline-hidden"
                style={{ WebkitTapHighlightColor: "transparent", touchAction: "pan-y" }}
                onPlay={() => {
                  setIsVideoPlaying(true);
                  setHasVideoStarted(true);
                  setHasVideoEnded(false);
                }}
                onPause={() => {
                  setIsVideoPlaying(false);
                }}
                onEnded={() => {
                  setIsVideoPlaying(false);
                  setHasVideoEnded(true);
                }}
                onContextMenu={(e) => e.preventDefault()}
              >
                <source src="https://i.imgur.com/mC573pR.mp4" type="video/mp4" />
                Seu navegador não suporta vídeos.
              </video>

              {/* Invisible interactive overlay: intercepts click/tap to toggle playback while allowing normal browser scrolling */}
              <div 
                onClick={handleVideoClick}
                className="absolute inset-0 z-10 cursor-pointer bg-transparent"
                style={{ WebkitTapHighlightColor: "transparent", touchAction: "pan-y" }}
              />
              
              {!hasVideoStarted && !hasVideoEnded && (
                <div 
                  onClick={handleStartWithSound}
                  className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 z-20"
                  style={{ touchAction: "pan-y" }}
                >
                  <div className="flex flex-col items-center gap-4">
                    {/* YouTube style Red Play Button */}
                    <div className="w-20 h-14 bg-[#FF0000] rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 scale-100 hover:scale-110 active:scale-95 relative group/btn">
                      {/* Pulsing red ring for organic video touch engagement */}
                      <span className="absolute -inset-2 rounded-2xl bg-[#FF0000]/30 animate-ping opacity-60" />
                      {/* Play Icon */}
                      <svg className="w-8 h-8 text-white fill-current ml-1" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="text-white font-extrabold text-xs tracking-widest uppercase px-4 py-1.5 rounded-full bg-black/60 shadow-md border border-white/10 backdrop-blur-xs">
                      CLIQUE PARA ASSISTIR
                    </span>
                  </div>
                </div>
              )}

              {hasVideoStarted && !isVideoPlaying && !hasVideoEnded && (
                <div 
                  onClick={handleVideoClick}
                  className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 z-20 animate-fade-in"
                  style={{ touchAction: "pan-y" }}
                >
                  <div className="flex flex-col items-center gap-3">
                    {/* Semi-transparent circular play button */}
                    <div className="w-16 h-16 bg-[#B45F4D] rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 scale-100 hover:scale-110 active:scale-95 relative">
                      <span className="absolute -inset-1.5 rounded-full bg-[#B45F4D]/40 animate-ping opacity-60" />
                      <svg className="w-6 h-6 text-white fill-current ml-1" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="text-white font-black text-xs tracking-wider uppercase px-4 py-1.5 rounded-full bg-black/75 border border-white/10 shadow-md backdrop-blur-xs">
                      VÍDEO PAUSADO - CLIQUE PARA RETOMAR
                    </span>
                  </div>
                </div>
              )}

              {hasVideoStarted && isVideoPlaying && !hasVideoEnded && (
                <div className="absolute bottom-3 right-3 z-20 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/10 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                  CLIQUE PARA PAUSAR
                </div>
              )}

              {hasVideoEnded && (
                <div 
                  onClick={handleReplayVideo}
                  className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 z-20 animate-fade-in"
                  style={{ touchAction: "pan-y" }}
                >
                  <div className="flex flex-col items-center gap-4 text-center px-6">
                    {/* Pulsing orange/red replay button */}
                    <div className="w-16 h-16 bg-[#B45F4D] rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 scale-100 hover:scale-110 active:scale-95 relative">
                      <span className="absolute -inset-2 rounded-full bg-[#B45F4D]/35 animate-ping opacity-70" />
                      {/* Replay Icon */}
                      <svg className="w-8 h-8 text-white fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-white font-black text-sm tracking-wider uppercase bg-[#B45F4D]/80 px-4 py-1.5 rounded-full border border-white/20 shadow-md">
                        ASSISTIR NOVAMENTE
                      </span>
                      <p className="text-stone-300 text-xs font-semibold leading-relaxed max-w-[240px]">
                        O vídeo terminou! Deseja assistir de novo para rever as bolsas e bônus?
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="text-sm md:text-base text-[#5F5F5F] max-w-3xl leading-relaxed font-medium mt-3 px-4">
            Acesso imediato à <strong className="text-stone-900 font-bold">Maior Coleção de Bolsas 3D do Brasil</strong> com mais de 70 modelos exclusivos de design diferenciado. Desenvolvido para mulheres e empreendedoras que querem sair da guerra de preços de artesanatos comuns e faturar alto com produtos físicos de grife que geram desejo imediato e são vendidos sem esforço!
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
              className="w-full sm:w-auto sm:px-12 py-4 bg-[#B45F4D] hover:bg-[#a04e3e] active:scale-[0.98] transition-all text-white font-bold font-display uppercase tracking-wide rounded-xl shadow-lg shadow-[#B45F4D]/25 text-base text-center cursor-pointer flex items-center justify-center gap-2 group"
            >
              <Zap className="w-5 h-5 fill-white animate-pulse" />
              QUERO ACESSAR OS MODELOS AGORA
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            {/* Microcopy de confiança */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] md:text-xs text-[#5F5F5F] mt-1 font-medium">
              <span className="flex items-center gap-1 text-emerald-600">
                <Check className="w-4.5 h-4.5" /> Acesso imediato
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-4.5 h-4.5 text-[#B45F4D]" /> Coleção completa e vitalícia
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-4.5 h-4.5 text-[#B45F4D]" /> Permissão de comercialização inclusa
              </span>
            </div>
          </div>
        </section>

        {/* =======================================
            SECTION 4 & 5: MARKETPLACES BESTSELLERS
           ======================================= */}
        <section id="mais-vendidos-marketplaces" className="flex flex-col gap-6 w-full py-6 text-center">
          <div className="max-w-2xl mx-auto flex flex-col gap-1.5 px-4">
            <span className="text-xs font-mono uppercase text-[#B45F4D] font-bold tracking-wider">Demanda Comprovada</span>
            <h2 className="text-lg md:text-xl font-bold font-display text-stone-900 leading-tight uppercase">
              A Diferença Entre Quem Sofre Sem Vendas e Quem Fatura Alto Todo Dia
            </h2>
            <p className="text-xs text-[#5F5F5F] leading-relaxed">
              Enquanto produtos comuns exigem um esforço gigante para convencer o cliente, as Bolsas 3D geram desejo imediato e são vendidas sem que você precise dar descontos.
            </p>
          </div>

          <MarketplaceCarousel />
        </section>

        {/* =======================================
            SECTION 7.5: ROTATING SHOWCASE CAROUSEL (MIDDLE OF THE PAGE)
           ======================================= */}
        <section id="galeria-rotativa" className="flex flex-col gap-5 w-full py-2">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-1 px-4">
            <span className="text-xs font-mono uppercase text-[#B45F4D] font-bold tracking-wider">Acabamento que Gera Desejo</span>
            <h2 className="text-lg md:text-xl font-bold font-display text-stone-900 leading-tight">
              Bolsas de Altíssimo Valor Percebido
            </h2>
            <p className="text-xs text-[#5F5F5F] leading-relaxed">
              Artesanato comum as pessoas acham bonito, mas não pagam muito. Já estas bolsas parecem itens de boutiques importadas de luxo!
            </p>
          </div>

          <div className="w-full">
            <ImageCarousel />
          </div>
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
        <section id="area-de-membros" className="bg-white text-stone-900 rounded-3xl p-6 md:p-10 border border-stone-200/80 shadow-sm flex flex-col gap-8 w-full relative overflow-hidden">
          {/* Subtle background glow effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#B45F4D]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-2xl mx-auto flex flex-col items-center z-10">
            <span className="text-xs font-mono uppercase text-[#B45F4D] font-extrabold tracking-widest bg-[#B45F4D]/10 px-3.5 py-1.5 rounded-full border border-[#B45F4D]/20">
              Passo a Passo de Vendas
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold font-display text-stone-900 mt-4 leading-tight uppercase tracking-tight">
              PORTAL EXCLUSIVO COM TUDO PRONTO PARA VENDER
            </h2>
            <p className="text-sm text-stone-600 mt-2 font-medium leading-relaxed max-w-lg">
              Além de todos os arquivos de bolsas luxuosas, nossa área de membros foi pensada para quem tem dificuldade com vendas. Você recebe o material pronto para divulgar e atrair clientes sem esforço!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
            {/* Video Column */}
            <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-center justify-center w-full">
              {/* Sleek Modern High-Fidelity Smartphone Mockup Frame in standard 9:16 Aspect Ratio with an Elegant Feminine Rose Gold / Champagne Pink finish */}
              <div ref={mockupContainerRef} className="relative mx-auto w-full max-w-[290px] sm:max-w-[310px] aspect-[9/16] bg-gradient-to-b from-[#fcd3de] via-[#f7cbd6] to-[#e4a0b2] rounded-[36px] p-[5px] shadow-[0_25px_60px_-15px_rgba(228,160,178,0.35),0_0_40px_rgba(251,195,208,0.25),inset_0_0_12px_rgba(255,255,255,0.9)] border-[5px] border-[#fbc3d0] ring-4 ring-[#ffeef2]/60 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_30px_70px_-10px_rgba(228,160,178,0.45)]">
                
                {/* Screen Reflection Accent removed to keep the video extremely clear, with no glare or reflection */}
                
                {/* Display Container with Slim Uniform Bezel */}
                <div className="relative w-full h-full rounded-[30px] p-[2.5px] bg-black z-20 border border-[#e4a0b2]/30 shadow-inner flex flex-col overflow-hidden isolate">
                  
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
                        <div className="w-6 h-6 border-2 border-[#e4a0b2] border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Features Column */}
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-5 text-left">
              <div className="flex items-center gap-2 text-[#B45F4D]">
                <Sparkles className="w-5 h-5 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider font-mono">Praticidade Absoluta</span>
              </div>

              <h3 className="text-xl md:text-2xl font-black font-display text-stone-900 leading-tight">
                Seu aprendizado e downloads em um portal de luxo
              </h3>

              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3 bg-stone-50/60 p-3.5 rounded-xl border border-stone-100 transition-all hover:bg-stone-100/50">
                  <div className="w-8 h-8 rounded-lg bg-[#B45F4D]/10 flex items-center justify-center text-[#B45F4D] shrink-0 font-bold">
                    <FolderKanban className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-stone-900">Organização Impecável por Categorias</h4>
                    <p className="text-xs text-stone-600 mt-1 font-medium leading-relaxed">
                      Chega de confusão ou pastas de drive bagunçadas. Nossos arquivos STL estão divididos por modelos de bolsas, alças, fechos e acessórios prontos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-stone-50/60 p-3.5 rounded-xl border border-stone-100 transition-all hover:bg-stone-100/50">
                  <div className="w-8 h-8 rounded-lg bg-[#B45F4D]/10 flex items-center justify-center text-[#B45F4D] shrink-0 font-bold">
                    <Download className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-stone-900">Download Instantâneo em 1 Clique</h4>
                    <p className="text-xs text-stone-600 mt-1 font-medium leading-relaxed">
                      Acesso imediato após o pagamento. Baixe seus arquivos direto na nuvem sem propagandas, links complicados ou telas de espera chatas.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-stone-50/60 p-3.5 rounded-xl border border-stone-100 transition-all hover:bg-stone-100/50">
                  <div className="w-8 h-8 rounded-lg bg-[#B45F4D]/10 flex items-center justify-center text-[#B45F4D] shrink-0 font-bold">
                    <Smartphone className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-stone-900">100% Compatível e Responsivo</h4>
                    <p className="text-xs text-stone-600 mt-1 font-medium leading-relaxed">
                      Acesse com toda a comodidade diretamente pelo seu smartphone, tablet ou computador, permitindo que você assista e acompanhe de onde preferir.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =======================================
            NEW SECTION: LICENÇA COMERCIAL EXCLUSIVA & VITALÍCIA
           ======================================= */}
        <section id="licenca-comercial" className="bg-stone-900 text-stone-100 rounded-3xl p-6 md:p-10 border border-stone-800 shadow-xl flex flex-col gap-6 md:gap-8 w-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#B45F4D]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-2xl mx-auto flex flex-col items-center z-10">
            <span className="text-xs font-mono uppercase text-[#B45F4D] font-extrabold tracking-widest bg-[#B45F4D]/15 px-3.5 py-1.5 rounded-full border border-[#B45F4D]/25">
              Licença Vitalícia Inclusa
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold font-display text-white mt-4 leading-tight uppercase tracking-tight">
              LICENÇA COMERCIAL LIVRE EXCLUSIVA
            </h2>
            <p className="text-sm text-stone-300 mt-2 font-medium leading-relaxed max-w-lg">
              Sua permissão definitiva para produzir e vender as peças físicas de forma 100% legal, segura e lucrativa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center z-10">
            <div className="flex flex-col gap-4 text-left">
              <div className="flex items-start gap-3 bg-stone-850 p-4 rounded-xl border border-stone-800 transition-all hover:bg-stone-800">
                <div className="w-10 h-10 rounded-lg bg-[#B45F4D]/10 border border-[#B45F4D]/20 flex items-center justify-center text-[#B45F4D] shrink-0 font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">Vendas 100% Autorizadas</h4>
                  <p className="text-xs text-stone-300 mt-1 font-medium leading-relaxed">
                    Você tem permissão oficial para imprimir as bolsas em sua impressora 3D e comercializar o produto físico final. Sem pagar royalties ou taxas por unidade vendida.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-stone-850 p-4 rounded-xl border border-stone-800 transition-all hover:bg-stone-800">
                <div className="w-10 h-10 rounded-lg bg-[#B45F4D]/10 border border-[#B45F4D]/20 flex items-center justify-center text-[#B45F4D] shrink-0 font-bold">
                  <Coins className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">Retenha 100% do Lucro</h4>
                  <p className="text-xs text-stone-300 mt-1 font-medium leading-relaxed">
                    Cada venda de R$ 180 a R$ 350 é sua de forma integral. Sem intermediários, sem pegadinhas. Uma única venda de bolsa já cobre o investimento total da coleção hoje!
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-stone-850/50 border border-stone-800 flex flex-col gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Certificado Autorizado</span>
                  <h4 className="text-sm font-extrabold text-white">Direito Comercial Vitalício</h4>
                </div>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed font-medium">
                Diferente de outros acervos que proíbem o comércio físico ou exigem licenças recorrentes caras, nossa permissão é vitalícia e inclusa sem custo adicional no seu pagamento único hoje.
              </p>
              <div className="border-t border-stone-800 pt-3 flex items-center justify-between">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Status do Documento</span>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold uppercase">
                  ATIVADO PARA NOVOS MEMBROS
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center mt-2 z-10">
            <button 
              onClick={(e) => scrollToPricing(e)}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#B45F4D] hover:bg-[#a04e3e] active:scale-[0.98] transition-all text-white font-bold font-display uppercase tracking-wider rounded-xl text-xs cursor-pointer flex items-center justify-center gap-2 group"
            >
              <Zap className="w-4 h-4 fill-white animate-pulse" />
              GARANTIR MEUS DIREITOS COMERCIAIS
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

        {/* =======================================
            SECTION 13: BÔNUS
           ======================================= */}
        <section id="bonus" className="bg-pink-50/50 rounded-2xl p-4 sm:p-5 md:p-8 border border-pink-100/85 shadow-xs flex flex-col gap-5 w-full">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[10px] sm:text-xs font-mono uppercase text-emerald-600 font-extrabold tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              Bônus Exclusivos
            </span>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black font-display text-stone-950 mt-2 leading-snug">
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
                image: "https://i.imgur.com/1A1KyZC.webp"
              },
              {
                id: 4,
                title: "ARTES E VETORES PARA ESTAMPAS",
                description: "Artes e estampas femininas minimalistas de alta qualidade, perfeitas para personalização.",
                originalPrice: "R$ 97,00",
                image: "https://i.imgur.com/VCkOTx6.webp"
              },
              {
                id: 5,
                title: "GUIA COMPLETO DE FATIAMENTO",
                description: "As melhores configurações e filamentos (PLA Silk, TPU, Flex) para criar bolsas perfeitas.",
                originalPrice: "R$ 49,90",
                image: "https://i.imgur.com/JxmeFMO.webp"
              },
              {
                id: 6,
                title: "CANECA E PORTA-COPOS PREMIUM",
                description: "Modelos modernos e decorativos de copos, canecas e suportes criativos de alta tendência.",
                originalPrice: "R$ 49,90",
                image: "https://i.imgur.com/w82oftQ.webp"
              },
              {
                id: 7,
                title: "KIT STL ANÉIS DE LUXO",
                description: "Arquivos de anéis sofisticados com anatomia moderna e alto apelo comercial.",
                originalPrice: "R$ 59,90",
                image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&h=400&q=80"
              },
              {
                id: 8,
                title: "HARMONIA E COMBINAÇÃO DE CORES",
                description: "Guia prático para combinar cores de filamentos e valorizar ainda mais o design das suas peças.",
                originalPrice: "R$ 39,90",
                image: "https://i.imgur.com/BmwbPhI.webp"
              }
            ].map((bonus) => (
              <div 
                key={bonus.id} 
                className="flex flex-col sm:flex-row gap-3 p-3 bg-[#FFF0F2] hover:bg-[#FFE3E7] rounded-xl border border-pink-200 hover:border-pink-300 transition-all duration-300 text-left items-start sm:items-center group relative overflow-hidden"
              >
                {/* Image Section */}
                <div className="w-full h-36 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-stone-50 rounded-lg border border-stone-200/80 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs relative">
                  <img 
                    {...getOptimizedImageProps(bonus.image, "l", "(max-width: 640px) 100vw, 112px")}
                    alt={bonus.title} 
                    loading="lazy"
                    decoding="async"
                    width={112}
                    height={112}
                    className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
                      bonus.image.includes('.png') || bonus.image.includes('.webp') && !bonus.image.includes('unsplash') ? 'object-contain p-2 bg-white' : 'object-cover'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Content Section */}
                <div className="flex flex-col gap-1.5 flex-1 justify-between h-full w-full">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="font-extrabold text-stone-900 text-xs sm:text-xs font-display leading-tight uppercase tracking-tight">
                      {bonus.title}
                    </h3>
                    <p className="text-[11px] text-stone-600 leading-tight font-medium">
                      {bonus.description}
                    </p>
                  </div>

                  {/* Pricing/Tags Footer */}
                  <div className="flex items-center gap-2 pt-1 border-t border-stone-200/40 w-full justify-between sm:justify-start">
                    <span className="text-[10px] text-stone-400 line-through font-semibold">
                      De {bonus.originalPrice}
                    </span>
                    <span className="inline-flex items-center bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-[9px] tracking-wider uppercase px-2 py-0.5 rounded shadow-3xs">
                      GRÁTIS
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Closing copy */}
          <div className="mt-1 p-3 bg-stone-100/50 border border-stone-200/60 rounded-xl text-center max-w-md mx-auto shadow-3xs">
            <p className="text-[11px] text-stone-700 leading-normal font-bold">
              “Todos esses bônus são adicionados ao seu acesso imediatamente, sem nenhum custo extra.”
            </p>
          </div>
        </section>

        {/* =======================================
            SECTION 10: DEMONSTRAÇÃO VISUAL (CATALOGO DE IMAGENS)
           ======================================= */}
        <section id="demonstracao-visual" className="flex flex-col gap-5 bg-gradient-to-b from-stone-50/50 via-stone-100/30 to-stone-50/50 px-3.5 py-6 sm:p-6 md:p-8 rounded-3xl border border-stone-200/60 shadow-inner w-full overflow-hidden">
          <div className="text-center max-w-xl mx-auto flex flex-col items-center w-full px-2">
            <div className="bg-gradient-to-tr from-cyan-100 via-[#B45F4D]/10 to-pink-100 p-2.5 rounded-full shadow-xs mb-3 flex items-center justify-center">
              <Gem className="w-5 h-5 text-cyan-600 animate-pulse" />
            </div>
            <span className="text-[10px] xs:text-xs font-mono uppercase text-[#B45F4D] font-extrabold tracking-widest text-center">Design Exclusivo</span>
            <h2 className="text-lg xs:text-xl md:text-2xl font-black font-display text-stone-950 mt-1.5 uppercase text-center tracking-tight break-words px-1 leading-tight">
              COLEÇÃO DE MODELOS ALTAMENTE DESEJÁVEIS
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
                  className="group relative aspect-square bg-stone-900 rounded-2xl shadow-lg border border-stone-800 transition-all duration-500 hover:scale-[1.04] hover:shadow-cyan-400/10 hover:shadow-xl hover:border-cyan-500/40 p-1 bg-gradient-to-tr from-stone-900 via-stone-800 to-stone-900"
                >
                  <div className="relative w-full h-full bg-white rounded-xl overflow-hidden flex items-center justify-center">
                    {/* High luxury reflection overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Zooming Cover Image */}
                    <img 
                      {...getOptimizedImageProps(item.url, "m", "(max-width: 640px) 50vw, 240px")}
                      alt={`Modelo exclusivo ${index + 1}`} 
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                      width={240}
                      height={240}
                      className="w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Hover Overlay with text */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-900/95 via-stone-900/70 to-transparent p-1.5 sm:p-2 text-center transition-all duration-300 transform translate-y-1.5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 z-10">
                      <span className="text-[8px] sm:text-[9.5px] font-mono tracking-normal sm:tracking-wider text-cyan-200 font-extrabold uppercase flex items-center justify-center gap-1 flex-wrap px-1 leading-tight">
                        <Gem className="w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0 text-cyan-300 animate-bounce" />
                        Acabamento Diamante
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="bg-white/85 rounded-2xl p-4 border border-stone-200/80 text-center max-w-xl mx-auto shadow-xs">
            <p className="text-xs text-[#5F5F5F] leading-relaxed font-medium">
              *Quanto mais modelos você tem no seu catálogo digital, mais possibilidades e nichos de mercado você consegue divulgar, testar e vender sem custos de modelagem.
            </p>
          </div>
        </section>

        {/* =======================================
            SECTION 11: OPORTUNIDADE E LUCRATIVIDADE (REPLACES COMPARISON)
           ======================================= */}
        <section id="comparacao" className="bg-white rounded-2xl p-6 md:p-8 border border-stone-200 shadow-sm w-full">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-mono uppercase text-[#B45F4D] font-extrabold tracking-wider bg-[#B45F4D]/10 px-3 py-1 rounded-full">O Segredo Revelado</span>
            <h2 className="text-2xl md:text-3xl font-extrabold font-display text-stone-900 mt-3 leading-tight">
              Por que é tão difícil vender artesanatos comuns e tão simples vender Bolsas 3D?
            </h2>
            <p className="text-sm md:text-base text-stone-700 mt-3 font-semibold leading-relaxed">
              Se você cansa de passar horas produzindo coisas que as pessoas acham bonitas, mas dizem que 'está caro', entenda como as Bolsas 3D de luxo quebram de vez essa barreira.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Infographic / Main Image Column */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 shadow-lg group w-full">
                <img 
                  {...getOptimizedImageProps("https://i.imgur.com/7PLtkdT.png", "l", "(max-width: 1024px) 100vw, 640px")}
                  alt="Comparação de Lucratividade na Impressão 3D" 
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  width={640}
                  height={400}
                  className="w-full h-auto block transition-transform duration-500 ease-out group-hover:scale-[1.01]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Persuasive Copy Column */}
            <div className="lg:col-span-5 flex flex-col gap-5 text-left">
              <div className="flex items-center gap-2 text-[#B45F4D]">
                <Gem className="w-5 h-5 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider font-mono">Por que vender Bolsas de Grife 3D?</span>
              </div>

              <h3 className="text-xl md:text-2xl font-black font-display text-stone-900 leading-tight">
                Chega de Tentar Vender de Tudo e Não Ter Resultados
              </h3>

              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-150 transition-all hover:bg-stone-100/50">
                  <div className="w-8 h-8 rounded-lg bg-[#B45F4D]/10 flex items-center justify-center text-[#B45F4D] shrink-0 font-bold">
                    <TrendingUp className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-stone-900">Valorização Real do Seu Trabalho</h4>
                    <p className="text-xs md:text-sm text-stone-600 mt-1 font-medium leading-relaxed">
                      Se você já tentou vender crochê, doces, roupas ou produtos comuns e cansou de ver pessoas pedindo desconto em peças baratas, as Bolsas 3D mudam o jogo. Cada peça é vendida facilmente de <strong className="text-stone-900 font-bold">R$ 180 a R$ 350</strong> com custo de produção extremamente baixo.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-150 transition-all hover:bg-stone-100/50">
                  <div className="w-8 h-8 rounded-lg bg-[#B45F4D]/10 flex items-center justify-center text-[#B45F4D] shrink-0 font-bold">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-stone-900">Desejo Incontrolável e Compra Fácil</h4>
                    <p className="text-xs md:text-sm text-stone-600 mt-1 font-medium leading-relaxed">
                      Diferente de outros produtos em que você precisa quase implorar para conseguir uma venda, as bolsas de design despertam desejo imediato no público feminino. Elas compram pelo impacto visual, status e exclusividade, sem questionar o preço.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-150 transition-all hover:bg-stone-100/50">
                  <div className="w-8 h-8 rounded-lg bg-[#B45F4D]/10 flex items-center justify-center text-[#B45F4D] shrink-0 font-bold">
                    <ShieldCheck className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-stone-900">Destaque Único sem Saturação</h4>
                    <p className="text-xs md:text-sm text-stone-600 mt-1 font-medium leading-relaxed">
                      Chega de competir com outras milhares de pessoas vendendo exatamente as mesmas coisas na internet ou na sua cidade. Com as Bolsas 3D de luxo, você sai da mesmice e domina um mercado de altíssimo valor com concorrência zero.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-2 p-3 bg-emerald-50 border border-emerald-500/10 rounded-xl flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-emerald-800">
                  Pare de se desgastar com o que não dá lucro e comece a faturar com produtos de alto valor.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =======================================
            NEW SECTION: HOJE VOCÊ RECEBE & ANCORAGEM DE VALOR
           ======================================= */}
        <section id="ancoragem-resumo" className="bg-stone-50 rounded-3xl p-6 md:p-10 border border-stone-200/80 shadow-xs flex flex-col gap-6 md:gap-8 w-full text-center">
          <div className="text-center max-w-2xl mx-auto flex flex-col items-center">
            <span className="text-xs font-mono uppercase text-[#B45F4D] font-extrabold tracking-widest bg-[#B45F4D]/10 px-3.5 py-1.5 rounded-full border border-[#B45F4D]/20">
              Acesso VIP Completo
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold font-display text-stone-900 mt-4 leading-tight uppercase tracking-tight">
              VEJA TUDO O QUE VOCÊ VAI RECEBER POR APENAS R$ 29,90
            </h2>
            <p className="text-sm text-stone-600 mt-2 font-medium leading-relaxed max-w-lg">
              Tudo o que você precisa para sair do zero e começar a faturar com bolsas e acessórios luxuosos.
            </p>
          </div>

          <div className="max-w-2xl mx-auto w-full flex flex-col gap-3.5 text-left bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-sm">
            <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <span className="w-2 h-4 bg-[#B45F4D] rounded-xs"></span>
              O que você vai receber:
            </h3>
            
            <div className="flex flex-col gap-2.5">
              {[
                "Mais de 70 modelos de bolsas e acessórios",
                "Licença comercial vitalícia inclusa",
                "Bônus: Pack de Joias e Acessórios 3D",
                "Bônus: Guia de Combinações de Cores",
                "Bônus: Chaveiros em 3D Personalizados",
                "Bônus: Guia Rápido de Organização de Arquivos",
                "Bônus: Lista de Públicos para Vender",
                "Bônus: Checklist de Postagem no Instagram e Redes Sociais",
                "Bônus: Plano Prático de 7 Dias para Começar",
                "Bônus: Tabela de Precificação de Bolsas 3D",
                "Atualizações futuras 100% gratuitas",
                "Suporte individual no WhatsApp",
                "Download 100% imediato",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-xs md:text-sm py-1">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-600">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="text-stone-700 font-semibold">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-emerald-50/50 -mx-6 md:-mx-8 px-6 md:px-8 py-4 rounded-b-2xl">
              <div className="flex flex-col text-center sm:text-left">
                <span className="text-[10px] uppercase text-[#B45F4D] font-extrabold tracking-wider font-mono">OPORTUNIDADE ÚNICA</span>
                <span className="text-xs md:text-sm text-stone-600 font-medium">Leve todo esse ecossistema completo por apenas</span>
              </div>
              <div className="text-center sm:text-right">
                <span className="text-2xl md:text-3xl font-black text-emerald-600 font-display">R$ 29,90 à vista!</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center mt-2">
            <button 
              onClick={(e) => scrollToPricing(e)}
              className="w-full max-w-md px-10 py-4 bg-[#B45F4D] hover:bg-[#a04e3e] active:scale-[0.98] transition-all text-white font-extrabold font-display uppercase tracking-wide rounded-xl shadow-md text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2 group"
            >
              <Zap className="w-4.5 h-4.5 fill-white animate-pulse" />
              QUERO A OFERTA COMPLETA POR APENAS R$ 29,90
              <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-[#B45F4D]/5 rounded-2xl p-5 md:p-6 text-center max-w-2xl mx-auto border border-[#B45F4D]/15 flex flex-col gap-3">
            <h3 className="text-base font-extrabold text-stone-900 uppercase">
              Por que estamos cobrando um valor tão absurdamente baixo?
            </h3>
            <p className="text-xs md:text-sm text-stone-700 leading-relaxed font-medium">
              Queremos que o maior número possível de mulheres e empreendedoras consiga começar um negócio lucrativo em impressão 3D de forma rápida e segura. Uma única venda de bolsa física de grife por R$ 180 já paga mais de 6 vezes o valor da nossa oferta completa hoje! O seu risco é absolutamente zero.
            </p>
          </div>
        </section>

        {/* =======================================
            SECTION 12: PLANOS & PREÇOS (PRICING)
           ======================================= */}
        <section id="pricing" className="flex flex-col gap-5">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-mono uppercase text-[#B45F4D] font-bold">Inicie sua Nova Fase</span>
            <h2 className="text-lg md:text-xl font-bold font-display text-stone-950 mt-1">
              Escolha o pack ideal e comece a vender de verdade hoje
            </h2>
            <p className="text-xs text-[#5F5F5F] mt-1">
              Diga adeus à frustração de não vender nada. Escolha o plano perfeito para você começar a faturar com produtos que as pessoas realmente desejam comprar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
            {/* CARD 1: PACK BÁSICO */}
            <div className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col gap-3.5 relative shadow-sm text-left md:self-start">
              <div className="flex flex-col gap-2.5">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-mono tracking-widest text-stone-400 font-bold uppercase">Pacote Inicial</span>
                  <h3 className="text-base font-extrabold font-display text-stone-900">PACK BÁSICO</h3>
                  <p className="text-xs text-[#5F5F5F]">
                    Ideal para dar os primeiros passos e testar a lucratividade das bolsas 3D.
                  </p>
                </div>

                {/* Preço */}
                <div className="py-2.5 border-t border-b border-stone-200 flex flex-col bg-stone-50/50 -mx-4 px-4 my-0.5">
                  <span className="text-[9px] text-[#B45F4D] uppercase font-extrabold tracking-wider">Oferta de Entrada</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xs text-stone-900 font-extrabold">R$</span>
                    <span className="text-3xl font-black text-stone-950 font-display tracking-tight">10,90</span>
                    <span className="text-[11px] text-stone-700 font-bold ml-1">único / à vista</span>
                  </div>
                  <span className="text-[9px] text-emerald-700 font-extrabold mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    ✓ Sem taxas ou mensalidades adicionais
                  </span>
                </div>

                {/* Itens Inclusos */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold text-stone-700 uppercase tracking-wider">Itens Inclusos:</span>
                  {[
                    "10 modelos selecionados a dedo",
                    "Licença comercial para venda física",
                    "Acesso vitalício aos arquivos STL",
                    "Download 100% imediato pós Pix"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#B45F4D] shrink-0 mt-0.5" />
                      <span className="text-xs text-stone-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => {
                  handleOpenCheckout("basico");
                }}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-850 text-white font-extrabold font-display uppercase tracking-wider rounded-xl transition-all cursor-pointer text-xs text-center shadow-sm active:scale-[0.98]"
              >
                COMEÇAR COM O PLANO BÁSICO
              </button>
            </div>

            {/* CARD 2: PACK COMPLETO / PREMIUM */}
            <div className="relative rounded-2xl p-[3px] bg-gradient-to-br from-[#00f2fe] via-[#9be3f9] to-[#4facfe] shadow-2xl shadow-cyan-500/20 scale-100 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-400/35">
              <div className="bg-[#111111] text-[#F8F6F3] rounded-[14px] p-5 flex flex-col justify-between gap-5 h-full relative text-left">
                <div className="absolute -top-4 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-stone-950 text-xs sm:text-sm font-black uppercase py-2 px-6 rounded-full tracking-widest shadow-xl border-2 border-white/40 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-10 whitespace-nowrap scale-105">
                  <Sparkles className="w-4 h-4 text-stone-950 fill-stone-950" />
                  O MAIS ESCOLHIDO
                </div>

                <div className="flex flex-col gap-3">
                  {/* Image placed on top, nicely framed */}
                  <div className="relative rounded-xl overflow-hidden border border-stone-800 bg-[#080808] mb-1.5 mt-2.5 shadow-md">
                    <img 
                      {...getOptimizedImageProps("https://i.imgur.com/WXWw5vE.webp", "l", "(max-width: 640px) 100vw, 400px")}
                      alt="Pack Completo Premium" 
                      referrerPolicy="no-referrer"
                      loading="eager"
                      fetchPriority="high"
                      width={400}
                      height={250}
                      className="w-full h-auto block"
                    />
                  </div>

                  {/* Preço */}
                  <div className="py-3 border-t border-b border-stone-800 flex flex-col">
                    <span className="text-[9px] text-[#00f2fe] uppercase font-black tracking-wider">Desconto de lançamento</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-sm text-stone-300 font-black">R$</span>
                      <span className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight drop-shadow-[0_0_10px_rgba(0,242,254,0.4)]">29,90</span>
                      <span className="text-xs text-stone-300 font-bold ml-1">ou até em 5x</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-black mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      ✓ Acesso vitalício e sem assinaturas
                    </span>
                  </div>

                  {/* Itens Inclusos */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-[#00f2fe] uppercase tracking-wider">O que você vai receber:</span>
                    {[
                      "Mais de 70 modelos de bolsas e acessórios",
                      "Licença comercial vitalícia inclusa",
                      "Bônus: Pack de Joias e Acessórios 3D",
                      "Bônus: Guia de Combinações de Cores",
                      "Bônus: Chaveiros em 3D Personalizados",
                      "Bônus: Guia Rápido de Organização de Arquivos",
                      "Bônus: Lista de Públicos para Vender",
                      "Bônus: Checklist de Postagem no Instagram e Redes Sociais",
                      "Bônus: Plano Prático de 7 Dias para Começar",
                      "Bônus: Tabela de Precificação de Bolsas 3D",
                      "Atualizações futuras 100% gratuitas",
                      "Suporte individual no WhatsApp",
                      "Download 100% imediato"
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-stone-100 font-semibold">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    window.location.href = "https://ggcheckout.app/checkout/v5/sGcFhzWO0zFmnQWdnK5h";
                  }}
                  className="w-full py-4 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] hover:from-[#00d2de] hover:to-[#3fa8de] text-stone-950 font-black font-display uppercase tracking-wider rounded-xl transition-all cursor-pointer text-xs text-center shadow-lg shadow-[#00f2fe]/20 active:scale-[0.98]"
                >
                  QUERO TODAS AS BOLSAS
                </button>
              </div>
            </div>
          </div>
        </section>



        {/* =======================================
            SECTION 15: GARANTIA & SEGURANÇA
           ======================================= */}
        <section id="garantia" className="bg-white rounded-3xl p-6 md:p-8 border-2 border-[#B45F4D]/20 shadow-lg max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-6 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#B45F4D]/5 rounded-full blur-2xl pointer-events-none" />
          
          <img 
            src="https://i.imgur.com/8srQFdp.png" 
            alt="Garantia de 7 dias de satisfação" 
            className="w-20 sm:w-24 h-auto shrink-0 object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.06)]"
            referrerPolicy="no-referrer"
          />

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono font-extrabold text-[#B45F4D] uppercase tracking-widest">Compromisso de Satisfação</span>
            <h3 className="text-base md:text-lg font-black font-display text-stone-950 leading-tight uppercase">
              GARANTIA BLINDADA DE 7 DIAS - RISCO ZERO!
            </h3>
            <p className="text-xs md:text-sm text-stone-600 leading-relaxed font-medium">
              Queremos que você tome essa decisão com total tranquilidade. Se por qualquer motivo você achar que a coleção não é para você, basta solicitar o reembolso em até 7 dias após a compra. Devolvemos 100% do seu dinheiro de forma rápida e sem perguntas ou complicação. Seu sucesso está garantido ou o seu dinheiro de volta!
            </p>
          </div>
        </section>

        {/* =======================================
            SECTION 16: FAQ (ACCORDION)
           ======================================= */}
        <section id="faq" className="flex flex-col gap-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase text-[#B45F4D] font-bold">Dúvidas Frequentes</span>
            <h2 className="text-xl md:text-2xl font-bold font-display text-stone-900 mt-1">
              Perguntas frequentes sobre o pack de bolsas
            </h2>
            <p className="text-xs text-[#5F5F5F] mt-1">
              Ainda com dúvidas? Veja as respostas para as principais dúvidas dos clientes abaixo.
            </p>
          </div>

          <div className="flex flex-col gap-3 max-w-2xl mx-auto w-full">
            {FAQS.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className="bg-white rounded-xl border border-stone-200/80 shadow-sm overflow-hidden transition-all text-left"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full p-4 flex justify-between items-center gap-3 font-semibold text-xs md:text-sm text-stone-900 hover:bg-stone-50 transition-colors text-left font-display cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen 
                      ? <ChevronUp className="w-4 h-4 text-[#B45F4D] shrink-0" /> 
                      : <ChevronDown className="w-4 h-4 text-[#5F5F5F] shrink-0" />
                    }
                  </button>

                  <div 
                    className={`transition-all duration-300 ${
                      isOpen ? "max-h-60 opacity-100 border-t border-stone-100 p-4" : "max-h-0 opacity-0 pointer-events-none"
                    }`}
                  >
                    <p className="text-xs md:text-sm text-[#5F5F5F] leading-relaxed">
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
        <section id="cta-final" className="text-center bg-[#B45F4D]/5 p-6 md:p-8 rounded-2xl border border-[#B45F4D]/25 flex flex-col items-center gap-4">
          <h2 className="text-xl md:text-2xl font-bold font-display text-stone-950 max-w-xl leading-tight">
            Você pode continuar imprimindo o comum… ou começar a mostrar peças que fazem as pessoas pararem para olhar
          </h2>
          
          <p className="text-xs md:text-sm text-[#5F5F5F] max-w-lg leading-relaxed">
            O Pack Bolsas 3D Lucrativas foi desenvolvido estrategicamente para quem deseja transformar sua impressora 3D comum em uma verdadeira vitrine geradora de orçamentos e vendas de alto valor agregado.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2">
            <button 
              onClick={(e) => scrollToPricing(e)}
              className="px-8 py-3.5 bg-[#B45F4D] hover:bg-[#a04e3e] text-white font-extrabold font-display text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
              QUERO TODAS AS BOLSAS
            </button>
            
            <button 
              onClick={(e) => scrollToPricing(e)}
              className="px-8 py-3.5 bg-stone-900 hover:bg-stone-850 text-white font-extrabold font-display text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
            >
              COMEÇAR COM O BÁSICO
            </button>
          </div>

          <div className="flex flex-col gap-1 text-[10px] text-[#5F5F5F] mt-2 font-medium">
            <span>⏱️ Preço promocional disponível por tempo estritamente limitado.</span>
            <span>🔒 Transação assegurada e criptografada com segurança de ponta.</span>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="text-center text-[10px] text-stone-400 mt-6 pt-6 border-t border-stone-200 flex flex-col gap-1.5">
          <p className="font-semibold text-stone-500">Pack Bolsas 3D Lucrativas • Todos os direitos reservados © 2026</p>
          <p className="max-w-md mx-auto leading-relaxed text-[9px]">
            Aviso de responsabilidade: Os resultados financeiros exibidos neste site são simulações de potencial e dependem exclusivamente da qualidade de sua fabricação física, preços locais, margem de filamento e competência na divulgação.
          </p>
        </footer>

      </main>

      {/* MOBILE FIXED FOOTER BAR REMOVED */}

      {/* =======================================
          INTERACTIVE CHECKOUT MODAL (SIMULADOR)
         ======================================= */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md border border-stone-200 shadow-2xl overflow-hidden relative text-left">
            
            {/* Botão de Fechar */}
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Cabeçalho do Checkout */}
            {checkoutStep === "upsell_diamond" ? (
              <div className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-stone-950 p-3 pr-12 flex items-center gap-3 relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/30 rounded-full blur-xl animate-pulse"></div>
                <div className="w-8 h-8 rounded-lg bg-stone-950/15 flex items-center justify-center shrink-0">
                  <Gem className="w-4 h-4 text-stone-950 animate-pulse" />
                </div>
                <div className="flex flex-col z-10">
                  <span className="text-[8px] font-mono uppercase font-black tracking-wider bg-stone-950 text-cyan-300 px-1.5 py-0.5 rounded self-start mb-0.5">
                    OFERTA ÚNICA &amp; EXCLUSIVA 💎
                  </span>
                  <h3 className="text-xs font-black font-display leading-none text-stone-950 uppercase tracking-tight">
                    Oportunidade Imperdível!
                  </h3>
                </div>
              </div>
            ) : (
              <div className="bg-[#B45F4D] text-white p-5 pr-12 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/80 font-mono uppercase font-bold tracking-wider">Ambiente de Compra Seguro</span>
                  <h3 className="text-base font-bold font-display leading-tight text-white">
                    {selectedPack === "basico" 
                      ? "Finalizar Pack Básico" 
                      : selectedPack === "diamante" 
                      ? "Finalizar Plano Diamante" 
                      : "Finalizar Pack Completo"}
                  </h3>
                </div>
              </div>
            )}

            {/* Conteúdo do Checkout com base no passo */}
            <div className="p-4 flex flex-col gap-3">

              {/* PASSO DE UPSELL: Plano Diamante */}
              {checkoutStep === "upsell_diamond" && (
                <div className="flex flex-col gap-2 text-center animate-fade-in">
                  <div className="bg-gradient-to-br from-[#F0F9FF] via-cyan-400/5 to-[#F6FBFD] border-2 border-cyan-400/80 rounded-xl p-2.5 sm:p-3 shadow-[0_6px_20px_rgba(6,182,212,0.1)] flex flex-col gap-1.5 relative overflow-hidden">
                    
                    {/* Decorative glowing background elements */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/5 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-sky-300/5 rounded-full blur-xl pointer-events-none" />

                    <div className="flex justify-center z-10">
                      <span className="bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-[0_2px_8px_rgba(6,182,212,0.25)]">
                        <Gem className="w-2.5 h-2.5 animate-pulse text-cyan-200 fill-cyan-200" />
                        ★ O MAIS ESCOLHIDO
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-black text-stone-950 font-display tracking-tight leading-tight z-10 uppercase">
                      Leve o <span className="text-cyan-700 font-extrabold underline decoration-cyan-400 underline-offset-2">Plano Diamante</span> completo por só <span className="text-emerald-700 font-black bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200/50">R$ 18,90</span>!
                    </h4>

                    <p className="text-[10px] sm:text-[11px] text-stone-800 leading-tight text-center font-semibold max-w-sm mx-auto z-10">
                      Adicione todos os <strong className="text-stone-950 font-black bg-cyan-100/60 px-1 rounded">70+ modelos de bolsas</strong> + <strong className="text-stone-950 font-black bg-cyan-100/60 px-1 rounded">+300 Vasos de Luxo</strong> por <span className="text-cyan-700 font-black">apenas R$ 8,00 a mais</span>!
                    </p>

                    <div className="grid grid-cols-2 gap-2 my-0.5 text-left z-10">
                      {/* Plano Básico */}
                      <div className="bg-stone-50/90 p-2 rounded-lg border border-stone-200 opacity-60 flex flex-col justify-center items-center text-center">
                        <span className="text-[7px] font-black text-stone-500 uppercase tracking-wider block">PLANO BÁSICO</span>
                        <span className="text-xs font-black text-stone-400 line-through mt-0.5">R$ 10,90</span>
                        <span className="text-[8px] text-red-500 font-bold block mt-0.5">Apenas 10 Modelos</span>
                      </div>

                      {/* Plano Diamante */}
                      <div className="bg-gradient-to-br from-cyan-50/80 via-white to-sky-50 p-2 rounded-lg border-2 border-cyan-400 ring-2 ring-cyan-400/10 flex flex-col justify-center items-center text-center relative shadow-sm">
                        <div className="absolute -top-2 right-1/2 translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[5px] font-black uppercase px-1 py-0.5 rounded shadow-sm whitespace-nowrap">
                          RECOMENDADO
                        </div>
                        <span className="text-[7px] font-black text-cyan-800 uppercase tracking-wider block">PLANO DIAMANTE</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-xs font-black text-cyan-950">R$ 18,90</span>
                          <span className="text-[7px] text-white font-black bg-emerald-600 px-0.5 rounded-sm">SÓ +R$ 8!</span>
                        </div>
                        <span className="text-[8px] text-cyan-800 font-bold block mt-0.5">70+ Modelos &amp; Bônus</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-full mt-0.5">
                    {/* Botão de Upgrade */}
                    <button
                      onClick={() => {
                        window.location.href = "https://ggcheckout.app/checkout/v5/nlQGFSmIdG30ilfRquS5";
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-[#00f2fe] via-[#00c6ff] to-[#4facfe] hover:from-[#00d2de] hover:to-[#3fa8de] text-stone-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-lg flex flex-col items-center justify-center gap-0 cursor-pointer shadow-[0_4px_12px_rgba(0,198,255,0.25)] transform hover:scale-[1.01] active:scale-[0.99] transition-all hover:shadow-[0_5px_15px_rgba(0,198,255,0.3)] animate-pulse"
                    >
                      <span className="flex items-center gap-1 font-black text-stone-950">
                        <Sparkles className="w-3 h-3 text-stone-950 fill-stone-950" />
                        ADICIONAR PLANO DIAMANTE R$ 18,90
                      </span>
                    </button>

                    {/* Botão para manter o básico */}
                    <button
                      onClick={() => {
                        window.location.href = "https://ggcheckout.app/checkout/v5/DlZTUavFROZtgejVqW41";
                      }}
                      className="w-full py-1.5 text-stone-400 hover:text-stone-600 font-bold text-[8px] uppercase rounded-lg cursor-pointer transition-all hover:underline"
                    >
                      Não, prefiro continuar com o básico de R$ 10,90
                    </button>
                  </div>
                </div>
              )}

              {/* PASSO 1: Selecionar método de pagamento */}
              {checkoutStep === "payment_method" && (
                <div className="flex flex-col gap-4">
                  <div className="bg-[#F8F6F3] p-3 rounded-lg border border-stone-200/60 flex justify-between items-center">
                    <span className="text-xs font-semibold text-stone-700">Pacote Escolhido:</span>
                    <span className="text-xs font-bold text-[#B45F4D] font-mono">
                      {selectedPack === "basico" 
                        ? "BÁSICO (R$ 10,90)" 
                        : selectedPack === "diamante" 
                        ? "PLANO DIAMANTE (R$ 18,90)" 
                        : "COMPLETO (R$ 29,90)"}
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 text-center leading-relaxed">
                    Selecione abaixo a forma fictícia de pagamento para simular a conclusão de compra imediatamente:
                  </p>

                  <div className="flex flex-col gap-2">
                    {/* Botão PIX */}
                    <button 
                      onClick={() => setCheckoutStep("pix_code")}
                      className="w-full p-4 border-2 border-[#1F9D55] bg-emerald-500/5 hover:bg-emerald-500/10 rounded-xl flex items-center justify-between transition-colors cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#1F9D55]/10 flex items-center justify-center text-[#1F9D55]">
                          <QrCode className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-stone-900 group-hover:text-[#1F9D55] transition-colors">Pagar com PIX</span>
                          <span className="text-[10px] text-stone-400">Liberação e download 100% instantâneos</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#1F9D55] group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Botão Cartão */}
                    <button 
                      onClick={() => setCheckoutStep("success")}
                      className="w-full p-4 border border-stone-200 bg-white hover:bg-stone-50 rounded-xl flex items-center justify-between transition-colors cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-stone-800">Pagar com Cartão</span>
                          <span className="text-[10px] text-stone-400">Crédito imediato em até 12x</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-400" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#5F5F5F] mt-2">
                    <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                    <span>Seus dados simulados estão 100% protegidos e seguros.</span>
                  </div>
                </div>
              )}

              {/* PASSO 2: Código PIX */}
              {checkoutStep === "pix_code" && (
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 animate-pulse">
                    <QrCode className="w-6 h-6" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <h4 className="font-bold text-stone-900 text-sm">Escaneie ou copie a chave PIX</h4>
                    <p className="text-xs text-[#5F5F5F] max-w-xs leading-relaxed">
                      Para simular o pagamento, copie a chave pix abaixo ou espere o cronômetro para aprovar automaticamente.
                    </p>
                  </div>

                  {/* QRCode Fictício */}
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <div className="w-36 h-36 bg-stone-200 flex flex-col items-center justify-center border border-dashed border-stone-300 relative">
                      <QrCode className="w-16 h-16 text-stone-400" />
                      <span className="text-[8px] font-mono font-bold text-stone-500 absolute bottom-2">MOCK QRCODE</span>
                    </div>
                  </div>

                  {/* Pix Copy and Paste Button */}
                  <div className="w-full flex flex-col gap-2">
                    <button
                      onClick={copyPixKey}
                      className="w-full py-3 bg-[#1F9D55] hover:bg-emerald-600 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {copiedPix ? (
                        <>
                          <CheckCircle className="w-4.5 h-4.5" />
                          PIX Copiado! Simulando aprovação...
                        </>
                      ) : (
                        <>
                          <Copy className="w-4.5 h-4.5" />
                          COPIAR CÓDIGO PIX COPIA E COLA
                        </>
                      )}
                    </button>
                    <p className="text-[9px] text-[#5F5F5F]">
                      *Após clicar em copiar, o simulador avançará automaticamente para o painel de entrega de arquivos!
                    </p>
                  </div>
                </div>
              )}

              {/* PASSO 3: Sucesso de Compra e download */}
              {checkoutStep === "success" && (
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle className="w-8 h-8" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <h4 className="font-bold text-stone-900 text-base">Pagamento Aprovado com Sucesso! 🎉</h4>
                    <p className="text-xs text-[#5F5F5F] leading-relaxed">
                      Seu pagamento simulado foi processado. Você acabou de garantir acesso vitalício e ilimitado ao pack!
                    </p>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg w-full text-left text-xs text-stone-800 leading-snug">
                    <span className="font-bold text-emerald-700 block mb-1">📦 Informações de Acesso Simuladas:</span>
                    <div>• <strong>Área de membros:</strong> link enviado no seu e-mail</div>
                    <div>• <strong>Acesso:</strong> joao.freitas.ads@gmail.com</div>
                    <div>• <strong>Quantidade:</strong> {selectedPack === "basico" ? "10 arquivos selecionados" : selectedPack === "diamante" ? "Plano Diamante com todos os 70+ arquivos + bônus vitalícios!" : "Mais de 70 arquivos + todos os bônus desbloqueados!"}</div>
                  </div>

                  <div className="w-full flex flex-col gap-2.5">
                    {/* Botão de download simulado */}
                    <a
                      href="data:text/plain;charset=utf-8,Parabéns%20pelo%20Pack%20Bolsas%203D%20Lucrativas!%20Seu%20acesso%20completo%20foi%20liberado."
                      download="Acesso_Pack_Bolsas_3D_Lucrativas.txt"
                      className="w-full py-3 bg-[#B45F4D] hover:bg-[#a04e3e] text-white font-extrabold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 cursor-pointer text-center shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      BAIXAR GUIA DE BOAS-VINDAS (PDF SIMULADO)
                    </a>
                    
                    <button
                      onClick={() => setIsCheckoutOpen(false)}
                      className="text-xs text-[#5F5F5F] underline hover:text-stone-800 cursor-pointer"
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
        <div className="fixed bottom-16 sm:bottom-6 left-6 z-40 bg-white border-2 border-emerald-500 rounded-xl p-4 shadow-2xl flex items-center gap-3.5 max-w-[320px] animate-fade-in-up text-stone-900">
          <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 text-lg shadow-xs">
            🎉
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-black text-stone-950 leading-tight">
              {toastMessage}
            </span>
            <span className="text-xs text-stone-700 font-semibold mt-0.5 leading-normal">
              acabou de adquirir a{" "}
              <span className="text-emerald-700 font-extrabold underline decoration-emerald-500/20">
                Oferta Diamante
              </span>
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
