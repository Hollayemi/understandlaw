"use client";

// Exact replication of the template's horizontal scrollable card strip:
// alternating between: (1) gradient stat cards with big white number + label
// and (2) photo cards with person image + publication badge + italic name

const CARDS = [
  // Card 1 — stat card (teal-green gradient)
  {
    type: "stat" as const,
    gradient: "linear-gradient(160deg, #2DD4BF 0%, #0D9488 40%, #065F46 100%)",
    label: "NIGERIANS WHO DON'T KNOW THEIR BASIC LEGAL RIGHTS",
    number: "70M+",
    id: "c1",
  },
  // Card 2 — person photo card
  {
    type: "person" as const,
    // Gradient overlay simulating a photo with colorful bg
    bg: "linear-gradient(160deg,#EC4899 0%,#BE185D 100%)",
    publication: "The Punch",
    category: "Criminal Law",
    name: "Adaeze Okonkwo",
    initials: "AO",
    id: "c2",
  },
  // Card 3 — person photo card
  {
    type: "person" as const,
    bg: "linear-gradient(160deg,#14B8A6 0%,#0F766E 100%)",
    publication: "BusinessDay",
    category: "Property Law",
    name: "Emeka Nwosu",
    initials: "EN",
    id: "c3",
  },
  // Card 4 — stat card (olive/green)
  {
    type: "stat" as const,
    gradient: "linear-gradient(160deg,#A3E635 0%,#65A30D 40%,#365314 100%)",
    label: "USERS HELPED UNDERSTAND THEIR RIGHTS",
    number: "100M+",
    id: "c4",
  },
  // Card 5 — person photo
  {
    type: "person" as const,
    bg: "linear-gradient(160deg,#818CF8 0%,#4F46E5 100%)",
    publication: "Nairametrics",
    category: "Employment Law",
    name: "Fatimah Bello",
    initials: "FB",
    id: "c5",
  },
  // Card 6 — stat
  {
    type: "stat" as const,
    gradient: "linear-gradient(160deg,#F472B6 0%,#DB2777 40%,#831843 100%)",
    label: "NBA-VERIFIED LAWYERS ON THE PLATFORM",
    number: "200+",
    id: "c6",
  },
  // Card 7 — person photo
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

// Card dimensions matching the template
const CARD_W = 280;
const CARD_H = 380;

export default function CardStrip() {
  return (
    <section className="bg-[#F3F3F3] overflow-hidden pt-2 pb-10">
      {/* Full-bleed horizontal strip — bleeds off screen on both sides, matching template */}
      <div
        className="flex gap-4 no-scrollbar overflow-x-auto"
        style={{ paddingLeft: 0, paddingRight: 32, cursor: "grab" }}
        onMouseDown={(e) => {
          const el = e.currentTarget;
          let startX = e.pageX - el.offsetLeft;
          let scrollLeft = el.scrollLeft;
          const onMove = (ev: MouseEvent) => {
            const x = ev.pageX - el.offsetLeft;
            el.scrollLeft = scrollLeft - (x - startX);
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
                className="strip-card flex flex-col justify-between p-7 flex-shrink-0 select-none"
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  background: card.gradient,
                  borderRadius: 20,
                }}
              >
                {/* Top label */}
                <p className="text-white/90 text-sm font-semibold uppercase leading-snug tracking-wide max-w-[180px]">
                  {card.label}
                </p>
                {/* Bottom number */}
                <span className="stat-number">{card.number}</span>
              </div>
            );
          }

          // person card
          return (
            <div
              key={card.id}
              className="strip-card flex flex-col justify-between select-none flex-shrink-0"
              style={{
                width: CARD_W,
                height: CARD_H,
                background: card.bg,
                borderRadius: 20,
                position: "relative",
              }}
            >
              {/* Simulated person silhouette / initials block */}
              <div className="flex items-center justify-center h-full">
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 96,
                  color: "rgba(255,255,255,0.2)",
                  lineHeight: 1,
                  userSelect: "none",
                }}>
                  {card.initials}
                </span>
              </div>

              {/* Bottom overlay info */}
              <div className="absolute bottom-0 left-0 right-0 p-5"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}>
                {/* Publication + category chip */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white font-semibold text-sm italic">{card.publication}</span>
                  <span className="bg-white/20 text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                    {card.category}
                  </span>
                </div>
                {/* Name */}
                <p className="text-white font-semibold text-base" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>
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
