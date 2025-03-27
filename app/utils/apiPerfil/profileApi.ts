const API_URL = "http://localhost:5154/api/perfil";

export interface PerfilDatos {
  nombre: string;
  correo: string;
  telefono: string;
}

export async function obtenerPerfil() {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token disponible");

    const response = await fetch("http://localhost:5154/api/perfil", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    throw error;
  }
}


export async function actualizarPerfil(datos: PerfilDatos) {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token disponible");

    const response = await fetch(`${API_URL}/editar`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    throw error;
  }
}
