// estadoAssets.tsx
export async function actualizarEstado(id: number, estado: string) {
    try {
      const response = await fetch(`https://localhost:7236/api/Assets/estado/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Estado: estado }),
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el estado');
      }
  
      const data = await response.json();
      console.log(data.message); // Confirmación de éxito
      return data;
    } catch (error) {
      console.error(error);
      throw new Error('Error al actualizar el estado');
    }
  }
  