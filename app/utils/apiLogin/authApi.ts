const API_URL = import.meta.env.VITE_API_URL;

// Función para iniciar sesión y almacenar el token con expiración
export async function loginRequest(correo: string, contrasena: string) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contrasena }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al iniciar sesión");

    const token = data.token;
    const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decodificar payload del token
    const expiration = decodedToken.exp * 1000; // Convertir a milisegundos

    localStorage.setItem("token", token);
    localStorage.setItem("token_expiration", expiration.toString());

    return { token };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// Función para solicitar recuperación de contraseña
export async function forgotPasswordRequest(email: string) {
  try {
    const response = await fetch(`${API_URL}/password/forgot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo: email }),
      mode: "cors",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al enviar la solicitud de recuperación");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// Función para restablecer la contraseña
export async function resetPasswordRequest(
  TokenRecuperacion: string,
  NuevaContrasena: string,
  ConfirmarContrasena: string
) {
  try {
    const response = await fetch(`${API_URL}/password/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ TokenRecuperacion, NuevaContrasena, ConfirmarContrasena }),
      mode: "cors",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al restablecer la contraseña");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// Función para verificar si el token ha expirado
export function isTokenExpired() {
  const expiration = localStorage.getItem("token_expiration");
  if (!expiration) return true;
  return Date.now() > parseInt(expiration, 10);
}

// Función para obtener el token solo si no ha expirado
export function getToken() {
  if (isTokenExpired()) {
    logout(); // Si expiró, limpiamos el token
    return null;
  }
  return localStorage.getItem("token");
}

// Función para cerrar sesión (elimina token y expiración)
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("token_expiration");
}
