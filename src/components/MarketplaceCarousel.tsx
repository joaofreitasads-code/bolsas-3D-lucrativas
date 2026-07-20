import React from "react";
import { getOptimizedImageProps } from "../utils/image";

const BESTSELLER_IMAGES = [
  {
    url: "https://i.imgur.com/gKe1HeY.png",
    alt: "Faturamento comprovado de bolsas de grife 3D no Mercado Livre",
    caption: "Sucesso no Mercado Livre",
    platform: "Mercado Livre"
  },
  {
    url: "https://i.imgur.com/BA7n32b.png",
    alt: "Bolsas de grife 3D em alta na Shopee",
    caption: "Destaque na Shopee",
    platform: "Shopee"
  },
  {
    url: "https://i.imgur.com/LaT7nJE.png",
    alt: "Estatísticas de alta conversão e lucros",
    caption: "Faturamento Comprovado",
    platform: "Mercado Livre"
  },
  {
    url: "https://i.imgur.com/X2AyOyS.png",
    alt: "Alta procura de bolsas 3D em marketplaces",
    caption: "Alta Demanda Ativa",
    platform: "Marketplace"
  }
];

export default function MarketplaceCarousel() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {BESTSELLER_IMAGES.map((item, index) => (
          <div 
            key={index} 
            className="group relative bg-[#111111] rounded-xl border border-stone-800/80 shadow-lg hover:shadow-2xl overflow-hidden flex flex-col transition-all duration-300 hover:scale-[1.02] hover:border-[#D4AF37]/35"
          >
            {/* Landscape (Deitadas) Image Container */}
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-stone-950 flex items-center justify-center">
              <img
                {...getOptimizedImageProps(item.url, "m", "(max-width: 640px) 100vw, 220px")}
                alt={item.alt}
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                width={220}
                height={138}
                className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

