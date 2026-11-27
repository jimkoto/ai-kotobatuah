interface KotoLogoProps {
  className?: string;
}

export function KotoLogo({ className = 'w-8 h-8' }: KotoLogoProps) {
  return (
    <span
      className={`inline-flex items-center justify-center overflow-hidden rounded-lg border border-stone-300/80 bg-[#F3EFE6] shrink-0 ${className}`}
    >
      <span className="block w-full h-[78%] overflow-hidden">
        <img
          src="/assets/aistudio/kotobatuah_836e973c.jpeg"
          alt="Logo Koto Batuah"
          width={64}
          height={64}
          className="w-full h-auto block origin-top scale-[1.28] -translate-y-[7%]"
        />
      </span>
    </span>
  );
}
