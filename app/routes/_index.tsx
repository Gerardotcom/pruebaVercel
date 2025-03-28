import { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate } from "@remix-run/react";
import { Loader2 } from "lucide-react";

// Carga diferida de componentes de Framer Motion
const MotionMain = lazy(() =>
  import("framer-motion").then((mod) => ({ default: mod.motion.main }))
);
const MotionImg = lazy(() =>
  import("framer-motion").then((mod) => ({ default: mod.motion.img }))
);
const MotionDiv = lazy(() =>
  import("framer-motion").then((mod) => ({ default: mod.motion.div }))
);

export default function Index() {
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => navigate("/login"), 1000);
    }, 3000);

    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <main className="w-screen h-screen bg-slate-200">
      <Suspense fallback={<div className="w-full h-full bg-slate-200" />}>
        <MotionMain
          className="w-full h-full"
          initial={{ opacity: 1 }}
          animate={{ opacity: fadeOut ? 0 : 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <div
            className="w-full h-full flex flex-col items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('images/backgrounds/background.png')" }}
          >
            <Suspense fallback={<div className="w-1/3 h-24 mb-8" />}>
              <MotionImg
                src="images/logos/Horizontal_white.png"
                alt="Logo"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="w-1/3 object-contain mb-8"
              />
            </Suspense>

            <Suspense fallback={<Loader2 className="w-10 h-10 text-white animate-spin" />}>
              <MotionDiv
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </MotionDiv>
            </Suspense>
          </div>
        </MotionMain>
      </Suspense>
    </main>
  );
}