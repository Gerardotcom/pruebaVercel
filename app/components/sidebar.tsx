import { LucideIcon, Home, SquareStack, TicketCheck, UserSearch, Wrench, UserPlusIcon } from "lucide-react";
import { Link } from "@remix-run/react";

export function Sidebar({ sidebarVisible, toggleSidebar }: { sidebarVisible: boolean; toggleSidebar: () => void }) {
  return (
    <aside
      className={`transition-all duration-300 fixed md:relative z-50 bg-primary flex flex-col items-center justify-between py-4 text-white h-full md:static 
      ${sidebarVisible ? 'min-w-64 max-w-64' : 'min-w-16 max-w-16'}`}
    >
      <div className="flex flex-col items-center w-full mt-8">

        {/* 🖱 Click en el logo para alternar sidebar */}
        <div
          onClick={toggleSidebar}
          className={`flex justify-center w-full transition-all duration-300 cursor-pointer ${sidebarVisible ? 'h-32' : 'h-16'}`}
        >
          <img
            src={sidebarVisible ? "/images/logos/Horizontal_white.png" : "/images/logos/Simbolo_white.png"}
            alt="Logo"
            className={`transition-all duration-300 ${sidebarVisible ? 'h-32' : 'h-12'}`}
          />
        </div>

        <nav className="flex flex-col space-y-8 mt-8 p-4 focus:outline-none">
          <SidebarButton icon={Home} label="Dashboard" to="/Dashboard" sidebarVisible={sidebarVisible} />
          <SidebarButton icon={SquareStack} label="Assets" to="/Assets" sidebarVisible={sidebarVisible} />
          <SidebarButton icon={TicketCheck} label="Tickets" to="/Tickets" sidebarVisible={sidebarVisible} />
          <SidebarButton icon={UserSearch} label="Clientes" to="/Clientes" sidebarVisible={sidebarVisible} />
          <SidebarButton icon={Wrench} label="Técnicos" to="/Tecnicos" sidebarVisible={sidebarVisible} />
          <SidebarButton icon={UserPlusIcon} label="Crear usuarios" to="/CrearUsuario" sidebarVisible={sidebarVisible} />
        </nav>
      </div>
    </aside>
  );
}

function SidebarButton({ icon: Icon, label, to, sidebarVisible }: { icon: LucideIcon; label: string; to: string; sidebarVisible: boolean }) {
  return (
    <Link to={to} className="flex items-center space-x-2 text-lg md:text-xl text-white py-2 px-4 md:px-6 rounded-md hover:bg-white/10 focus:outline-none">
      <Icon className="w-6 h-6" />
      {sidebarVisible && <span className="truncate max-w-[12rem]">{label}</span>}
    </Link>
  );
}
