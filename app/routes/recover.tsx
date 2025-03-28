import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { forgotPasswordRequest } from "~/utils/apiLogin/authApi";

export default function Recover() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [focused, setFocusedLabel] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });

  const navigate = useNavigate();

  const validateEmail = () => {
    if (!email) {
      setError("El correo electrónico es obligatorio");
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Ingrese un correo válido");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateEmail()) return;

    try {
      await forgotPasswordRequest(email);
      setMessage("Se ha enviado un correo de recuperación de contraseña.");
    } catch (error: any) {
      setError(error.message || "Error al enviar el correo");
    }
  };

  const setFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocusedLabel((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const setBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocusedLabel((prev) => ({ ...prev, [e.target.name]: false }));
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-sky-50 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl p-8 rounded-3xl transform transition duration-300 hover:scale-105">
        <div className="flex justify-center mb-6">
          <img src="/images/logos/Horizontal_blue.png" alt="Logo" className="w-40" />
        </div>

        <h1 className="text-2xl font-bold text-primary text-center mb-6">
          Recuperar Contraseña
        </h1>

        {error && <p className="text-red-500 text-xs text-center mb-4">{error}</p>}
        {message && <p className="text-green-500 text-xs text-center mb-4">{message}</p>}

        {/* Input de Correo */}
        <div className="relative mb-6">
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={setFocus}
            onBlur={setBlur}
            className="peer w-full cursor-text bg-white border-b-2 text-sm text-gray-800 placeholder-gray-500 p-3 focus:outline-none transition-all border-gray-400 focus:border-primary"
          />

          <label
            htmlFor="email"
            className={`absolute left-3 transition-all text-black ${email || focused.email ? "-top-2 text-xs text-primary" : "top-3"
              }`}
          >
            Correo Electrónico
          </label>
        </div>

        {/* Botón de Enviar */}
        <button
          className="w-full text-white py-3 bg-primary rounded-lg hover:scale-105 transition-all"
          onClick={handleSubmit}
        >
          Enviar
        </button>

        {/* Volver al Login */}
        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-blue-600 hover:underline transition-all"
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    </div>
  );
}
