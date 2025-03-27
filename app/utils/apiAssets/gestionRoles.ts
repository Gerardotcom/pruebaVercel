const API_BASE_URL = "http://localhost:5008/api/Usuario/registrar";
const API_ROLES_URL = "http://localhost:5008/api/Usuario/roles";

/**
 * Función para registrar un nuevo usuario.
 */
export const createUser = async (data: {
    nombre: string;
    correo: string;
    contrasena: string;
    telefono: string;
    idRol: number;
  }) => {
    try {
      const payload = {
        ...data,
        salt: "string", // Valor por defecto
        fechaRegistro: new Date().toISOString(), // Generar fecha actual
      };
  
      console.log("📌 JSON que se enviará a la API:");
      console.log(JSON.stringify(payload, null, 2)); // 🔍 Verifica si coincide con Swagger
  
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const responseBody = await response.text();
      console.log("📌 Respuesta de la API:", responseBody);
  
      if (!response.ok) {
        throw new Error( "Error al registrar usuario: ${responseBody}");
      }
  
      return JSON.parse(responseBody);
    } catch (error) {
      console.error("🚨 Error creando usuario:", error);
      throw error;
    }
  };
/**
 * Función para obtener la lista de roles disponibles.
 */
export const getRoles = async () => {
  try {
    const response = await fetch(API_ROLES_URL, { method: "GET" });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.mensaje || "Error al obtener los roles");
    }

    return result; // Devolver la lista de roles
  } catch (error) {
    console.error("Error obteniendo roles:", error);
    return []; // Devolver array vacío en caso de error
  }
};