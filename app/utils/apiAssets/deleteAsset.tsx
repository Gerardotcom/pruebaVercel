const API_URL = "https://localhost:7236/api/Assets"; // Reemplaza con la URL de tu API

// Función para eliminar un asset
export const eliminarAsset = async (id: string | number): Promise<string> => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Error al eliminar el asset");
        }

        const result = await response.json();
        return result.message; // Mensaje de éxito
    } catch (error) {
        console.error("Error al eliminar el asset:", error);
        throw error; // Propagar el error para que pueda manejarse en el componente
    }
};
