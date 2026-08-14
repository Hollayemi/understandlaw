const Logo = ({ className, showText }: { className?: string; showText?: boolean }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
        <img src="/images/icon.jpg" alt="LawTicha Logo" className="w-8 h-8 flex-shrink-0" />
        
        {showText && (
          <span className="font-bold text-[17px] text-gray-900 tracking-tight" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Law<span className="text-[#F97316]">Ticha</span>
          </span>
        )}
    </div>
  );
}
export default Logo;