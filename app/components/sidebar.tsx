import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import type { LucideIcon } from "lucide-react";

export function Sidebar({ sidebarVisible, toggleSidebar }: { sidebarVisible: boolean; toggleSidebar: () => void }) {
  return (
    <aside
      className={`transition-all duration-300 fixed md:relative z-50 bg-primary flex flex-col items-center justify-between py-4 text-white h-full md:static 
      ${sidebarVisible ? "min-w-64 max-w-64" : "min-w-16 max-w-16"}`}
    >
      <div className="flex flex-col items-center w-full mt-8">
        {/* 🖱 Click en el logo para alternar sidebar */}
        <div
          onClick={toggleSidebar}
          className={`flex justify-center w-full transition-all duration-300 cursor-pointer ${sidebarVisible ? "h-32" : "h-16"}`}
        >
          <img
            src={sidebarVisible ? "/images/logos/Horizontal_white.png" : "/images/logos/Simbolo_white.png"}
            alt="Logo"
            className={`transition-all duration-300 ${sidebarVisible ? "h-32" : "h-12"}`}
          />
        </div>

        <nav className="flex flex-col space-y-8 mt-8 p-4 focus:outline-none">
          <SidebarButton iconName="Home" label="Dashboard" to="/Dashboard" sidebarVisible={sidebarVisible} />
          <SidebarButton iconName="SquareStack" label="Assets" to="/Assets" sidebarVisible={sidebarVisible} />
          <SidebarButton iconName="TicketCheck" label="Tickets" to="/Tickets" sidebarVisible={sidebarVisible} />
          <SidebarButton iconName="UserSearch" label="Clientes" to="/Clientes" sidebarVisible={sidebarVisible} />
          <SidebarButton iconName="Wrench" label="Técnicos" to="/Tecnicos" sidebarVisible={sidebarVisible} />
          <SidebarButton iconName="UserPlus" label="Crear usuarios" to="/CrearUsuario" sidebarVisible={sidebarVisible} />
        </nav>
      </div>
    </aside>
  );
}

// 🎯 SidebarButton con importación dinámica y corrección de TypeScript
function SidebarButton({
  iconName,
  label,
  to,
  sidebarVisible,
}: {
  iconName: string;
  label: string;
  to: string;
  sidebarVisible: boolean;
}) {
  const [Icon, setIcon] = useState<LucideIcon | null>(null);

  useEffect(() => {
    import("lucide-react").then((module) => {
      const iconsMap = module as unknown as Record<string, LucideIcon>; // ✅ Cast seguro
      setIcon(() => iconsMap[iconName] || iconsMap["Dot"]); // 🏠 Icono por defecto
    });
  }, [iconName]);

  return (
    <Link
      to={to}
      className="flex items-center space-x-2 text-lg md:text-xl text-white py-2 px-4 md:px-6 rounded-md hover:bg-white/10 focus:outline-none"
    >
      {Icon ? <Icon className="w-6 h-6" /> : <div className="w-6 h-6 bg-transparent rounded" />}
      {sidebarVisible && <span className="truncate max-w-[12rem]">{label}</span>}
    </Link>
  );
}
