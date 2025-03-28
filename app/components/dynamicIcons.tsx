import type { LucideIcon } from "lucide-react";
import { useState, useEffect } from "react";


// ✅ Componente para importar los íconos dinámicamente
export function DynamicIcon({ iconName, className }: { iconName: string; className?: string }) {
    const [Icon, setIcon] = useState<LucideIcon | null>(null);
  
    useEffect(() => {
      import("lucide-react").then((module) => {
        const iconsMap = module as unknown as Record<string, LucideIcon>;
        setIcon(() => iconsMap[iconName] || iconsMap["Dot"]); // Icono por defecto
      });
    }, [iconName]);
  
    return Icon ? <Icon className={className} /> : <div className={`w-6 h-6 bg-transparent rounded ${className}`} />;
  }
  