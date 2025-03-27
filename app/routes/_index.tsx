import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Index() {
  const [fadeOut, setFadeOut] = useState(false); // Controla el desvanecimiento
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir a la página de login después de completar la carga
    const redirectTimer = setTimeout(() => {
      setFadeOut(true); // Inicia la transición de desvanecimiento
      setTimeout(() => navigate("/login"), 1000); // Redirige después de 1s
    }, 3000); // Total: 3 segundos

    return () => {
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <main className="w-screen h-screen bg-slate-200">
      <motion.main
        className="w-full h-full"
        initial={{ opacity: 1 }}
        animate={{ opacity: fadeOut ? 0 : 1 }} // Desvanece al cambiar fadeOut
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        {/* Contenedor de fondo */}
        <div
          className="w-full h-full flex flex-col items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: "url('images/backgrounds/background.png')" }}
        >
          {/* Animación del logo */}
          <motion.img
            src="images/logos/Horizontal_white.png"
            alt="Logo"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-1/3 object-contain mb-8"
          />

          {/* Rueda de carga */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </motion.div>
        </div>
      </motion.main>
    </main>
  );
}
