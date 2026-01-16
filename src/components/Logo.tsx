import logoImage from "@/assets/logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function Logo({ size = "md", showText = true }: LogoProps) {
  const sizes = {
    sm: { container: "w-8 h-8", text: "text-sm" },
    md: { container: "w-12 h-12", text: "text-xl" },
    lg: { container: "w-16 h-16", text: "text-2xl" },
  };

  const currentSize = sizes[size];

  return (
    <div className="flex items-center space-x-3 group">
      <div className={`${currentSize.container} rounded-full overflow-hidden flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg bg-white dark:bg-gray-800 p-1`}>
        <img 
          src={logoImage} 
          alt="CSAM Zaccaria TSS Logo" 
          className="w-full h-full object-contain rounded-full"
        />
      </div>
      {showText && (
        <div>
          <h1 className={`${currentSize.text} font-bold text-school-primary dark:text-school-accent group-hover:text-school-accent dark:group-hover:text-school-primary transition-colors leading-tight`}>
            CSAM Zaccaria TSS
          </h1>
          <p className="text-xs text-muted-foreground">TVET Excellence</p>
        </div>
      )}
    </div>
  );
}
