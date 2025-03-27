// Definir la estructura del objeto assetData
interface AssetData {
    nombreAsset: string;
    descripcion: string;
    ubicacion: string;
    capacidad: string;
    // Agrega más propiedades según tu modelo de datos
}

const API_URL = "https://localhost:7236/api/Assets"; // Reemplaza con la URL de tu API

// Tipo de parámetros en la función editarAsset
export const editarAsset = async (id: string | number, assetData: AssetData) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(assetData),
        });

        if (!response.ok) {
            throw new Error("Error al actualizar el asset");
        }

        return await response.json();
    } catch (error) {
        console.error("Error en la actualización del asset:", error);
        throw error;
    }
};
