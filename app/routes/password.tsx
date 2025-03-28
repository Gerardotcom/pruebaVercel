import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { Eye, EyeOff } from "lucide-react";
import { resetPasswordRequest } from "~/utils/apiLogin/authApi";

export default function Password() {
  const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [errors, setErrors] = useState({ newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [apiError, setApiError] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setApiError("Token inválido o expirado.");
    }
  }, [token]);

  // Expresión regular para contraseña segura
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validatePasswords = () => {
    let newErrors = { newPassword: "", confirmPassword: "" };
    let valid = true;

    // Validar nueva contraseña
    if (!formData.newPassword) {
      newErrors.newPassword = "Ingrese una nueva contraseña";
      valid = false;
    } else if (!passwordRegex.test(formData.newPassword)) {
      newErrors.newPassword = "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial";
      valid = false;
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirme su contraseña";
      valid = false;
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    setMessage("");
    setApiError("");

    if (!validatePasswords() || !token) return;

    try {
      const response = await resetPasswordRequest(
        token,
        formData.newPassword,
        formData.confirmPassword
      );
      setMessage(response.message || "Contraseña restablecida correctamente");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      setApiError(error.message);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-sky-50 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl p-8 rounded-3xl transform transition duration-300 hover:scale-105">
        <div className="flex justify-center mb-6">
          <img src="/images/logos/Horizontal_blue.png" alt="Logo" className="w-40" />
        </div>
        <h1 className="text-2xl font-bold text-[#0047BA] text-center mb-6">
          Nueva Contraseña
        </h1>

        {apiError && <p className="text-red-500 text-xs text-center mb-4">{apiError}</p>}
        {message && <p className="text-green-500 text-xs text-center mb-4">{message}</p>}

        {/* Campo de nueva contraseña */}
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            name="newPassword"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            onFocus={() => setFocused("newPassword")}
            onBlur={() => setFocused(null)}
            className="peer w-full bg-white border-b-2 text-sm text-black p-3 focus:outline-none transition-all border-gray-400 focus:border-[#0047BA]"
          />
          <label
            className={`absolute left-3 transition-all text-black ${
              formData.newPassword || focused === "newPassword" ? "-top-2 text-xs text-[#0047BA]" : "top-3"
            }`}
          >
            Nueva contraseña
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 hover:text-[#0047BA] transition-all"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
        </div>

        {/* Campo de confirmación de contraseña */}
        <div className="relative mb-6">
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            onFocus={() => setFocused("confirmPassword")}
            onBlur={() => setFocused(null)}
            className="peer w-full bg-white border-b-2 text-sm text-black p-3 focus:outline-none transition-all border-gray-400 focus:border-[#0047BA]"
          />
          <label
            className={`absolute left-3 transition-all text-black ${
              formData.confirmPassword || focused === "confirmPassword" ? "-top-2 text-xs text-[#0047BA]" : "top-3"
            }`}
          >
            Confirmar contraseña
          </label>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>

        {/* Botón de aceptar */}
        <button
          className="w-full text-white py-3 bg-[#0047BA] rounded-lg hover:scale-105 transition-all"
          onClick={handleSubmit}
        >
          Aceptar
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
