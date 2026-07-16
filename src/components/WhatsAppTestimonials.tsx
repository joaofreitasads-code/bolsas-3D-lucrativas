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
    id: 5,
    type: "image",
    url: "https://i.imgur.com/3FZKGCe.webp",
    caption: "Depoimento de Sucesso no WhatsApp"
  },
  {
    id: 6,
    type: "image",
    url: "https://i.imgur.com/XsBaUIw.webp",
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

  // Preload only the next image in the sequence to save memory
  useEffect(() => {
    const nextIndex = (currentIndex + 1) % TESTIMONIALS.length;
    const nextItem = TESTIMONIALS[nextIndex];
    if (nextItem && nextItem.type === "image" && nextItem.url) {
      const img = new Image();
      img.src = nextItem.url;
    }
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const activeTestimonial = TESTIMONIALS[currentIndex];

  return (
    <div className="w-full flex flex-col gap-8 bg-[#FAF9F6] p-5 md:p-8 rounded-2xl border border-stone-200/80 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Text and Benefits */}
        <div className="lg:col-span-5 flex flex-col gap-4 text-left">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider self-start">
            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
            Depoimentos Reais do WhatsApp
          </div>

          <h3 className="text-2xl md:text-3xl font-bold font-display text-stone-900 leading-tight">
            Veja o sucesso de quem já imprime e vende!
          </h3>

          <p className="text-xs md:text-sm text-[#5F5F5F] leading-relaxed">
            Nada fala mais alto do que resultados reais. Nossos clientes estão dominando as vendas locais de bolsas impressas em 3D, saindo de peças comuns para acessórios de alto valor agregado e alta lucratividade!
          </p>

          <div className="flex flex-col gap-3.5 mt-2 bg-white p-4 rounded-xl border border-stone-200/60 shadow-sm">
            <div className="flex gap-2.5 items-start">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
              <div className="text-xs">
                <strong className="text-stone-900">Retorno Rápido:</strong> Muitos alunos recuperam o valor total do Pack logo na primeira bolsa vendida.
              </div>
            </div>
            <div className="flex gap-2.5 items-start">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
              <div className="text-xs">
                <strong className="text-stone-900">Designs Otimizados:</strong> Arquivos testados, criados para economizar filamento e evitar suportes chatos.
              </div>
            </div>
            <div className="flex gap-2.5 items-start">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
              <div className="text-xs">
                <strong className="text-stone-900">Pronto para Lucrar:</strong> Comece a faturar imediatamente com modelos exclusivos de alta costura.
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Slider with Side Arrows */}
        <div className="lg:col-span-7 flex flex-col items-center w-full">
          <div className="relative w-full max-w-[480px] flex items-center justify-center group">
            
            {/* Left Arrow Button */}
            <button
              onClick={handlePrev}
              className="absolute -left-3 md:-left-6 bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 p-2 md:p-3 rounded-full border border-stone-200 shadow-md hover:shadow-lg transition-all duration-200 z-20 focus:outline-none cursor-pointer"
              aria-label="Depoimento anterior"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Testimonial Container Box */}
            <div className="w-full bg-white rounded-xl border border-stone-200 shadow-md flex flex-col justify-center items-center overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="w-full h-full flex flex-col items-center justify-center"
                >
                  {activeTestimonial.type === "image" ? (
                    /* Literal Image Display (as requested, with no mobile frame or click-to-expand badges) */
                    <div className="w-full flex flex-col items-center justify-center">
                      <img
                        {...getOptimizedImageProps(activeTestimonial.url || "", "l", "(max-width: 640px) 100vw, 480px")}
                        alt={activeTestimonial.caption}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                        width={480}
                        height={640}
                        className="w-full h-auto block select-none rounded-xl"
                      />
                    </div>
                  ) : (
                    /* Clean High-Fidelity WhatsApp Style Styled Card */
                    <div className="w-full flex flex-col justify-between h-full p-4 md:p-6 min-h-[340px] md:min-h-[400px] text-left">
                      <div className="flex items-center gap-3 border-b border-stone-100 pb-3 mb-3">
                        <img
                          {...getOptimizedImageProps(activeTestimonial.avatar || "", "m", "40px")}
                          alt={activeTestimonial.clientName}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          decoding="async"
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover border border-emerald-500/20 shadow-sm"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-stone-900 leading-tight">
                            {activeTestimonial.clientName}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-mono font-medium">
                            {activeTestimonial.location} • Cliente Ativo
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col justify-center">
                        <div className="bg-emerald-50/70 border border-emerald-100 p-4 rounded-xl relative">
                          {/* WhatsApp Speech Bubble Pointer */}
                          <div className="absolute top-4 -left-2 w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-emerald-50/70 border-b-[8px] border-b-transparent"></div>
                          <p className="text-stone-800 text-xs md:text-sm leading-relaxed italic">
                            &ldquo;{activeTestimonial.message}&rdquo;
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-50">
                        <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">
                          Mensagem de Suporte Oficial
                        </span>
                        <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                          Verificado ✓
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Arrow Button */}
            <button
              onClick={handleNext}
              className="absolute -right-3 md:-right-6 bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 p-2 md:p-3 rounded-full border border-stone-200 shadow-md hover:shadow-lg transition-all duration-200 z-20 focus:outline-none cursor-pointer"
              aria-label="Próximo depoimento"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>

          </div>

          {/* Dots Indicator */}
          <div className="flex gap-1.5 mt-4">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx ? "bg-[#B45F4D] w-5" : "bg-stone-300 hover:bg-stone-400"
                }`}
                aria-label={`Ir para o depoimento ${idx + 1}`}
              />
            ))}
          </div>

          <span className="text-[10px] font-mono text-stone-400 mt-2">
            Use as setas nas laterais para navegar instantaneamente entre os depoimentos
          </span>
        </div>
      </div>
    </div>
  );
}
