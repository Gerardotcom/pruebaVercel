import { Tecnico } from "./tecnico";

export const editTecnico = async (id: number, tecnicoData: any) => {
  console.log("Llamando a la API con ID:", id); // Depuración: Verifica el ID
  console.log("Datos enviados a la API:", tecnicoData); // Depuración: Verifica los datos
  try {
    console.log('Datos enviados:', tecnicoData); // Depuración: Imprime los datos enviados

    const response = await fetch(`https://localhost:7177/api/tecnicos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tecnicoData),
    });

    if (!response.ok) {
      const errorResponse = await response.json(); // Captura la respuesta de error
      console.error('Error del backend:', errorResponse); // Depuración: Verifica el error del backend
      throw new Error(errorResponse.message || 'Error al actualizar el técnico');
    }

    const result = await response.json();
    return result; // Devuelve la respuesta de la API
  } catch (error) {
    console.error('Error en editarTecnico:', error); // Depuración: Verifica el error
    throw error; // Lanza el error para manejarlo en el componente
  }
};
