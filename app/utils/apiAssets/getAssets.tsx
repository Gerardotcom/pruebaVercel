export async function getAssets(page: number = 1, limit: number = 10) {
    try {
      const response = await fetch(
        `https://localhost:7236/api/Assets/ObtenerAssets?page=${page}&limit=${limit}`
      );
    
      if (!response.ok) {
        throw new Error("Error al obtener los assets");
      }
    
      const data = await response.json();
      console.log("Datos recibidos de getAssets:", data); // Agregar este log para inspeccionar la respuesta
      
      return data;
    } catch (error) {
      console.error("Error al obtener los assets:", error);
      throw error; // Relanzar el error para que se maneje en el nivel superior
    }
  }
  