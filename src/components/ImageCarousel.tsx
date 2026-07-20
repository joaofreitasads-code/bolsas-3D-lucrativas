import React from "react";
import { getOptimizedImageProps } from "../utils/image";

export const CAROUSEL_IMAGES = [
  { url: "https://i.imgur.com/DnuaZYa.webp", caption: "Bolsa de Grife - Design Exclusivo" },
  { url: "https://i.imgur.com/kA3oDNb.webp", caption: "Modelo Premium - Sofisticação Suprema" },
  { url: "https://i.imgur.com/ucxS8av.webp", caption: "Clutch Elegante - Detalhes de Alta Costura" },
  { url: "https://i.imgur.com/owlo85R.webp", caption: "Bolsa de Ombro - Tendência Internacional" },
  { url: "https://i.imgur.com/1ZrOAYg.webp", caption: "Handbag Geométrico - Estilo Único" },
  { url: "https://i.imgur.com/0OYGdYF.webp", caption: "Design Orgânico - Luxo e Modernidade" },
  { url: "https://i.imgur.com/UlVdHnP.webp", caption: "Bolsa Escultural 3D - Acabamento Perfeito" },
  { url: "https://i.imgur.com/WpXschZ.webp", caption: "Modelo Fashionista - Alta Costura 3D" },
  { url: "https://i.imgur.com/jHAsRHH.webp", caption: "Clutch Luxuosa - Design Vanguardista" },
  { url: "https://i.imgur.com/anSVxa9.webp", caption: "Bolsa de Grife - Sofisticação Moderna" }
];

export default function ImageCarousel() {
  // Duplicating the image list to ensure a seamless continuous loop
  const marqueeImages = [...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES];

  return (
    <div className="w-full max-w-full relative overflow-hidden py-4 select-none rounded-3xl border border-stone-800 bg-[#121212]">
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 50s linear infinite;
          will-change: transform;
          transform: translate3d(0, 0, 0);
        }
        .animate-marquee-track:hover {
          animation-play-state: paused;
        }
        /* Custom scrollbars for modal if needed */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Edge shadow gradient overlays for premium feel */}
      <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-[#121212] via-[#121212]/50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-[#121212] via-[#121212]/50 to-transparent z-10 pointer-events-none" />

      {/* Continuous Auto-Scrolling Track */}
      <div className="animate-marquee-track gap-4 md:gap-6 px-4">
        {marqueeImages.map((img, idx) => (
          <div
            key={idx}
            className="relative flex-shrink-0 w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden cursor-default border border-stone-800 bg-stone-900 shadow-md group transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:border-[#D4AF37]/40"
          >
            {/* Background image - fully filling the square */}
            <img
              {...getOptimizedImageProps(img.url, "m", "(max-width: 640px) 208px, (max-width: 768px) 256px, 288px")}
              alt={img.caption}
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
              width={288}
              height={288}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
            />

            {/* Gradient Overlay & Text Caption */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/10 to-transparent flex flex-col justify-end p-4">
              <h4 className="text-white text-xs md:text-sm font-bold font-display tracking-tight leading-snug drop-shadow-md">
                {img.caption}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
