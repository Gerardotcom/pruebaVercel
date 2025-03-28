import { Settings, Edit, Power, Menu } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  toggleSidebar: () => void;
  title: string;
}

export function Navbar({ toggleSidebar, title }: NavbarProps) {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    setTooltipVisible(!tooltipVisible);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); //  Elimina el token del almacenamiento
    navigate("/login", { replace: true }); // Redirige a la pantalla de login
  };

  return (
    <header className="w-full flex justify-between items-center py-4 px-12 bg-sky-50 text-slate-800 border-b">
      <button onClick={toggleSidebar} className="md:hidden p-2 rounded-md text-gray-800 hover:bg-gray-200">
        <Menu className="w-6 h-6" />
      </button>
      <h1 className="text-#0047ba md:text-3xl font-semibold">{title}</h1>
      <div className="flex items-center space-x-4">
        <button onClick={handleSettingsClick} className="relative">
          <Settings className="w-6 h-6 cursor-pointer" />
          {tooltipVisible && (
            <div className="z-50 absolute top-8 right-0 w-48 bg-white shadow-md rounded-md p-2 space-y-2">
              <button
                className="w-full flex items-center space-x-2 text-gray-800 hover:bg-gray-200 p-2 rounded-md"
                onClick={() => {
                  navigate("/perfil");
                  setTooltipVisible(false); //  Cierra el menú al hacer clic
                }}
              >
                <Edit className="w-5 h-5" />
                <span>Editar perfil</span>
              </button>
              <button
                className="w-full flex items-center space-x-2 text-gray-800 hover:bg-gray-200 p-2 rounded-md"
                onClick={handleLogout} //  Llama a la función de logout
              >
                <Power className="w-5 h-5" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </button>
        <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
          <img src="images/user.jpg" alt="Perfil" className="w-full h-full object-cover" />
        </div>
      </div>
    </header>
  );
}
