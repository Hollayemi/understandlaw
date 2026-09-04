const Logo = ({ className, showText }: { className?: string; showText?: boolean }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
        <img src="/images/icon.jpg" alt="LawTicha Logo" className="w-8 h-8 flex-shrink-0" />
        
        {showText && (
          <span className="font-bold text-[17px] tracking-tight" style={{ fontFamily: "var(--font-dm-sans)", color: "var(--maroon-700)" }}>
            LawTicha
          </span>
        )}
    </div>
  );
}
export default Logo;