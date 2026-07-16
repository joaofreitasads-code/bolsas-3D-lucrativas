import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getOptimizedImageProps } from "../utils/image";

const BESTSELLER_IMAGES = [
  {
    url: "https://i.imgur.com/3XBK15R.webp",
    alt: "Bolsa mais vendida no Mercado Livre - Caso Real de Faturamento",
    caption: "Sucesso de Vendas no Mercado Livre",
    platform: "Mercado Livre"
  },
  {
    url: "https://i.imgur.com/UWLsnB0.webp",
    alt: "Estatísticas de alta demanda em marketplaces",
    caption: "Milhares de buscas mensais ativas",
    platform: "Mercado Livre"
  },
  {
    url: "https://i.imgur.com/AEmXkDw.webp",
    alt: "Faturamento comprovado de bolsas de grife 3D",
    caption: "Margem de lucro acima de 400%",
    platform: "Mercado Livre"
  },
  {
    url: "https://i.imgur.com/13Vb4UC.webp",
    alt: "Anúncio de bolsas de grife 3D na Shopee",
    caption: "Destaque absoluto de vendas na Shopee",
    platform: "Shopee"
  },
  {
    url: "https://i.imgur.com/a14IlPv.webp",
    alt: "Depoimentos e avaliações 5 estrelas de compradores",
    caption: "Satisfação máxima de clientes exigentes",
    platform: "Shopee"
  },
  {
    url: "https://i.imgur.com/Qq8DDm1.webp",
    alt: "Estatísticas de vendas consolidadas na Shopee",
    caption: "Grande volume de pedidos diários",
    platform: "Shopee"
  },
  {
    url: "https://i.imgur.com/KCGa4gj.webp",
    alt: "Alta procura de bolsas no Facebook Marketplace",
    caption: "Anúncios com alta conversão no Facebook Marketplace",
    platform: "Facebook Marketplace"
  },
  {
    url: "https://i.imgur.com/Z9Lzv32.webp",
    alt: "Sucesso de vendas e interesse do cliente no Facebook",
    caption: "Centenas de mensagens de compradores interessados",
    platform: "Facebook Marketplace"
  }
];

export default function MarketplaceCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Preload only the next image in sequence to save memory
  useEffect(() => {
    const nextIndex = (currentIndex + 1) % BESTSELLER_IMAGES.length;
    const nextItem = BESTSELLER_IMAGES[nextIndex];
    if (nextItem && nextItem.url) {
      const img = new Image();
      img.src = nextItem.url;
    }
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? BESTSELLER_IMAGES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === BESTSELLER_IMAGES.length - 1 ? 0 : prev + 1));
  };

  const activeImage = BESTSELLER_IMAGES[currentIndex];

  return (
    <div className="w-full max-w-[480px] mx-auto flex flex-col items-center">
      <div className="relative w-full bg-white rounded-2xl border border-stone-200/80 shadow-md flex items-center justify-center overflow-hidden group">
        
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 p-2 rounded-full border border-stone-200 shadow-md hover:shadow-lg transition-all duration-200 z-10 focus:outline-none cursor-pointer"
          aria-label="Imagem anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Carousel slide transition */}
        <div className="w-full flex flex-col justify-center items-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="w-full flex flex-col items-center justify-center"
            >
              <img
                {...getOptimizedImageProps(activeImage.url, "l", "(max-width: 640px) 100vw, 480px")}
                alt={activeImage.alt}
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                width={480}
                height={640}
                className="w-full h-auto block rounded-2xl select-none"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 p-2 rounded-full border border-stone-200 shadow-md hover:shadow-lg transition-all duration-200 z-10 focus:outline-none cursor-pointer"
          aria-label="Próxima imagem"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
