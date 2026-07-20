import React, { useState, useEffect } from "react";
import { CheckCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getOptimizedImageProps } from "../utils/image";

interface TestimonialSlide {
  id: number;
  type: "image" | "styled";
  url?: string;
  clientName?: string;
  location?: string;
  avatar?: string;
  message?: string;
  caption?: string;
}

const TESTIMONIALS: TestimonialSlide[] = [
  {
    id: 10,
    type: "image",
    url: "https://i.imgur.com/XzJANpV.jpeg",
    caption: "Depoimento de Sucesso no WhatsApp"
  },
  {
    id: 11,
    type: "image",
    url: "https://i.imgur.com/sc7Y9DF.jpeg",
    caption: "Depoimento de Sucesso no WhatsApp"
  },
  {
    id: 12,
    type: "image",
    url: "https://i.imgur.com/YFQdiFG.jpeg",
    caption: "Depoimento de Sucesso no WhatsApp"
  },
  {
    id: 9,
    type: "image",
    url: "https://i.imgur.com/2KKcWRl.jpeg",
    caption: "Depoimento de Sucesso no WhatsApp"
  },
  {
    id: 1,
    type: "image",
    url: "https://i.imgur.com/G8BEKkc.webp",
    caption: "Depoimento de Sucesso no WhatsApp"
  },
  {
    id: 2,
    type: "image",
    url: "https://i.imgur.com/WVth2xe.webp",
    caption: "Depoimento de Sucesso no WhatsApp"
  },
  {
    id: 3,
    type: "image",
    url: "https://i.imgur.com/pspp5LK.webp",
    caption: "Depoimento de Sucesso no WhatsApp"
  },
  {
    id: 4,
    type: "image",
    url: "https://i.imgur.com/PaRDZN6.webp",
    caption: "Depoimento de Sucesso no WhatsApp"
  },
  {
    id: 7,
    type: "image",
    url: "https://i.imgur.com/mE5Lfko.webp",
    caption: "Depoimento de Sucesso no WhatsApp"
  },
  {
    id: 8,
    type: "image",
    url: "https://i.imgur.com/zHi2odQ.webp",
    caption: "Depoimento de Sucesso no WhatsApp"
  }
];

export default function WhatsAppTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Preload all testimonial images to make navigation completely instant
  useEffect(() => {
    TESTIMONIALS.forEach((item) => {
      if (item.type === "image" && item.url) {
        const img = new Image();
        img.src = item.url;
      }
    });
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const activeTestimonial = TESTIMONIALS[currentIndex];

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-5">
      {/* Small Introductory Copy */}
      <div className="text-center max-w-xs sm:max-w-sm mx-auto flex flex-col gap-1 px-4">
        <span className="text-[10px] font-mono uppercase text-emerald-400 font-extrabold tracking-widest">
          RESULTADOS REAIS
        </span>
        <p className="text-xs sm:text-sm text-stone-300 font-semibold leading-relaxed">
          Veja as mensagens de quem já está faturando alto e dominando o mercado com nossas matrizes premium.
        </p>
      </div>

      {/* Centered Smartphone Mockup Wrapper with fixed responsive dimensions */}
      <div className="relative w-full max-w-[290px] sm:max-w-[310px] flex items-center justify-center group mt-2 h-[580px] sm:h-[620px] shrink-0">
        
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          className="absolute -left-12 sm:-left-16 bg-stone-950/90 hover:bg-stone-900 text-stone-300 hover:text-[#D4AF37] p-3 rounded-full border border-stone-800 shadow-xl hover:shadow-2xl transition-all duration-200 z-30 focus:outline-none cursor-pointer hover:scale-105 active:scale-95"
          aria-label="Depoimento anterior"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Premium Smartphone Bezel in White - with perfectly constant height and aspect ratio */}
        <div className="relative w-full h-full bg-[#111111] rounded-[42px] border-[10px] border-stone-100 shadow-[0_25px_60px_-15px_rgba(255,255,255,0.08)] overflow-hidden flex flex-col ring-4 ring-black/40">
          {/* Dynamic Island / Speaker Line */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4.5 bg-black rounded-full z-40 flex items-center justify-between px-3">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-900"></span>
            <div className="w-10 h-1 bg-stone-800/80 rounded-full"></div>
            <span className="w-1 h-1 rounded-full bg-emerald-500/80 animate-pulse"></span>
          </div>

          {/* Testimonial Image inside the phone - absolute full size to prevent any height jitter */}
          <div className="w-full h-full bg-[#111111] flex flex-col justify-center items-center overflow-hidden pt-7 flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.08, ease: "linear" }}
                className="w-full h-full flex flex-col items-center justify-center"
              >
                {activeTestimonial.type === "image" ? (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <img
                      {...getOptimizedImageProps(activeTestimonial.url || "", "l", "(max-width: 640px) 100vw, 480px")}
                      alt={activeTestimonial.caption}
                      referrerPolicy="no-referrer"
                      loading="eager"
                      decoding="async"
                      width={480}
                      height={640}
                      className="w-full h-full select-none rounded-[32px] object-cover object-top"
                    />
                  </div>
                ) : (
                  /* Styled card inside phone template */
                  <div className="w-full h-full flex flex-col justify-between p-4 text-left bg-stone-900 rounded-[32px]">
                    <div className="flex items-center gap-3 border-b border-stone-800 pb-3 mb-3">
                      <img
                        {...getOptimizedImageProps(activeTestimonial.avatar || "", "m", "40px")}
                        alt={activeTestimonial.clientName}
                        referrerPolicy="no-referrer"
                        loading="eager"
                        decoding="async"
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover border border-emerald-500/20 shadow-sm"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white leading-tight">
                          {activeTestimonial.clientName}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono font-medium">
                          {activeTestimonial.location} • Cliente Ativo
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                      <div className="bg-emerald-950/40 border border-emerald-500/10 p-3 rounded-xl relative">
                        <div className="absolute top-4 -left-2 w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-emerald-950/40 border-b-[8px] border-b-transparent"></div>
                        <p className="text-stone-200 text-xs leading-relaxed italic">
                          &ldquo;{activeTestimonial.message}&rdquo;
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-800">
                      <span className="text-[9px] font-mono text-stone-500 uppercase tracking-wider">
                        Mensagem de Suporte Oficial
                      </span>
                      <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                        Verificado ✓
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          className="absolute -right-12 sm:-right-16 bg-stone-950/90 hover:bg-stone-900 text-stone-300 hover:text-[#D4AF37] p-3 rounded-full border border-stone-800 shadow-xl hover:shadow-2xl transition-all duration-200 z-30 focus:outline-none cursor-pointer hover:scale-105 active:scale-95"
          aria-label="Próximo depoimento"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

      </div>

      {/* Dots Indicator */}
      <div className="flex gap-1.5 mt-2">
        {TESTIMONIALS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
              currentIndex === idx ? "bg-emerald-500 w-5" : "bg-stone-800 hover:bg-stone-700"
            }`}
            aria-label={`Ir para o depoimento ${idx + 1}`}
          />
        ))}
      </div>

      <span className="text-[10px] font-mono text-stone-500 text-center uppercase tracking-wider">
        Toque nas setas laterais para navegar
      </span>
    </div>
  );
}
