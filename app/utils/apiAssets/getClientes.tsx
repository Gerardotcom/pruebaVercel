export async function getClientes() {
    const response = await fetch(`https://localhost:7236/api/Assets/ObtenerClientes`);
  
    if (!response.ok) {
      throw new Error("Error al obtener los clientes");
    }
  
    const data = await response.json();
  
    console.log("Clientes obtenidos:", data); // Verifica que la respuesta es la esperada
    return data;
  }
  