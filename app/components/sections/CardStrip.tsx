"use client";

const CARDS = [
  {
    type: "stat" as const,
    gradient: "linear-gradient(160deg, #7A1E2C 0%, #4D0E1B 60%, #2E0810 100%)",
    label: "NIGERIANS WHO DON'T KNOW THEIR BASIC LEGAL RIGHTS",
    number: "70M+",
    image: "/images/teacher1.jpg",
    id: "c1",
  },
  {
    type: "person" as const,
    bg: "linear-gradient(160deg,#A83A52 0%,#6B1220 100%)",
    publication: "The Punch",
    category: "Police Law",
    name: "Adaeze Okonkwo",
    initials: "AO",
    image: "/images/police_law.jpg",
    id: "c2",
  },
  {
    type: "person" as const,
    bg: "linear-gradient(160deg,#8C3B3B 0%,#4A1414 100%)",
    publication: "BusinessDay",
    category: "Contract Law",
    name: "Emeka Nwosu",
    image: "/images/contract_law.jpg",
    initials: "EN",
    id: "c3",
  },
  {
    type: "stat" as const,
    gradient: "linear-gradient(160deg,#82212D 0%,#5C1420 60%,#3D0A14 100%)",
    label: "USERS HELPED UNDERSTAND THEIR RIGHTS",
    number: "100K+",
    image: "/images/teacher2.jpg",
    id: "c4",
  },
  {
    type: "person" as const,
    bg: "linear-gradient(160deg,#9B2E3D 0%,#4D0E1B 100%)",
    publication: "Nairametrics",
    category: "Employment Law",
    name: "Fatimah Bello",
    image: "/images/employment_law.jpg",
    initials: "FB",
    id: "c5",
  },
  {
    type: "stat" as const,
    gradient: "linear-gradient(160deg,#B24A5E 0%,#6B1220 60%,#3D0A14 100%)",
    label: "SCN-VERIFIED LAWYERS ON THE PLATFORM",
    number: "200+",
    image: "/images/tenancy_law.jpg",
    id: "c6",
  },
  {
    type: "person" as const,
    bg: "linear-gradient(160deg,#A05A3E 0%,#4D0E1B 100%)",
    publication: "TechCabal",
    category: "Business Law",
    name: "Chidi Okafor",
    image: "/images/tenancy_law.jpg",
    initials: "CO",
    id: "c7",
  },
];

export default function CardStrip() {
  return (
    <div
      className="flex gap-4 no-scrollbar overflow-x-auto cursor-grab active:cursor-grabbing select-none"
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
              className="flex-shrink-0 rounded-[20px] overflow-hidden p-6 relative flex flex-col justify-between"
              style={{ width: 190, height: 340, background: card.gradient }}
            >
              <img src={card.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
              <p className="relative text-white/90 text-[11px] font-semibold uppercase leading-snug tracking-wide max-w-[150px]">
                {card.label}
              </p>
              <span
                className="relative text-white text-[42px] leading-none font-black"
                style={{ fontFamily: "var(--font-archivo-black)" }}
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
            style={{ width: 190, height: 340, background: card.bg }}
          >
            <img src={card.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
            {/* Initials watermark */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-[72px] leading-none text-white/15 font-black"
                style={{ fontFamily: "var(--font-archivo-black)" }}
              >
                {card.initials}
              </span>
            </div>

            {/* Bottom info */}
            <div
              className="absolute bottom-0 left-0 right-0 p-4"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)" }}
            >
              <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                <span className="text-white font-semibold text-xs">{card.publication}</span>
                <span className="text-white/50 text-xs">|</span>
                <span className="text-white/85 text-xs font-medium">{card.category}</span>
              </div>
              <p className="text-white font-semibold text-sm italic" style={{ fontFamily: "var(--font-playfair)" }}>
                {card.name}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}