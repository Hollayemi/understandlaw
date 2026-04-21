"use client";
import React from "react";

const CARDS = [
  {
    type: "stat" as const,
    gradient: "linear-gradient(160deg, #2DD4BF 0%, #0D9488 40%, #065F46 100%)",
    label: "NIGERIANS WHO DON'T KNOW THEIR BASIC LEGAL RIGHTS",
    number: "70M+",
    id: "c1",
  },
  {
    type: "person" as const,
    bg: "linear-gradient(160deg,#EC4899 0%,#BE185D 100%)",
    publication: "The Punch",
    category: "Criminal Law",
    name: "Adaeze Okonkwo",
    initials: "AO",
    id: "c2",
  },
  {
    type: "person" as const,
    bg: "linear-gradient(160deg,#14B8A6 0%,#0F766E 100%)",
    publication: "BusinessDay",
    category: "Property Law",
    name: "Emeka Nwosu",
    initials: "EN",
    id: "c3",
  },
  {
    type: "stat" as const,
    gradient: "linear-gradient(160deg,#A3E635 0%,#65A30D 40%,#365314 100%)",
    label: "USERS HELPED UNDERSTAND THEIR RIGHTS",
    number: "100M+",
    id: "c4",
  },
  {
    type: "person" as const,
    bg: "linear-gradient(160deg,#818CF8 0%,#4F46E5 100%)",
    publication: "Nairametrics",
    category: "Employment Law",
    name: "Fatimah Bello",
    initials: "FB",
    id: "c5",
  },
  {
    type: "stat" as const,
    gradient: "linear-gradient(160deg,#F472B6 0%,#DB2777 40%,#831843 100%)",
    label: "NBA-VERIFIED LAWYERS ON THE PLATFORM",
    number: "200+",
    id: "c6",
  },
  {
    type: "person" as const,
    bg: "linear-gradient(160deg,#FB923C 0%,#EA580C 100%)",
    publication: "TechCabal",
    category: "Business Law",
    name: "Chidi Okafor",
    initials: "CO",
    id: "c7",
  },
];

export default function CardStrip() {
  return (
    <section className="bg-[#F3F3F3] overflow-hidden pb-10 pt-2">
      <div
        className="flex gap-4 no-scrollbar overflow-x-auto pr-8 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={(e) => {
          const el = e.currentTarget;
          const startX = e.pageX - el.offsetLeft;
          const scrollLeft = el.scrollLeft;
          const onMove = (ev: MouseEvent) => {
            el.scrollLeft = scrollLeft - (ev.pageX - el.offsetLeft - startX);
          };
          const onUp = () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
          };
          window.addEventListener("mousemove", onMove);
          window.addEventListener("mouseup", onUp);
        }}
      >
        {CARDS.map((card) => {
          if (card.type === "stat") {
            return (
              <div
                key={card.id}
                className="flex-shrink-0 rounded-[20px] overflow-hidden p-7 flex flex-col justify-between"
                style={{ width: 280, height: 380, background: card.gradient }}
              >
                <p className="text-white/90 text-sm font-semibold uppercase leading-snug tracking-wide max-w-[180px]">
                  {card.label}
                </p>
                <span
                  className="text-white text-[clamp(52px,6vw,80px)] leading-none"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  {card.number}
                </span>
              </div>
            );
          }

          return (
            <div
              key={card.id}
              className="flex-shrink-0 rounded-[20px] overflow-hidden relative"
              style={{ width: 280, height: 380, background: card.bg }}
            >
              {/* Initials watermark */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-[96px] leading-none text-white/20 font-normal"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  {card.initials}
                </span>
              </div>

              {/* Bottom info */}
              <div
                className="absolute bottom-0 left-0 right-0 p-5"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white font-semibold text-sm italic">{card.publication}</span>
                  <span className="bg-white/20 text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                    {card.category}
                  </span>
                </div>
                <p
                  className="text-white font-semibold text-base italic"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {card.name}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
