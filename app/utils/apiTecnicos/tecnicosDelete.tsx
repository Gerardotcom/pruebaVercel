export const deleteTecnico = async (idTecnico: number): Promise<boolean> => {
    try {
        const response = await fetch(`https://localhost:7177/api/tecnicos/${idTecnico}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('No se pudo eliminar el técnico');
        }

        // Usa response.text() en lugar de response.json()
        const result = await response.text(); // Lee la respuesta como texto plano
        return true; // Devuelve true si la eliminación fue exitosa
    } catch (error) {
        console.error('Error al eliminar el técnico:', error);
        return false; // Devuelve false si hubo un error
    }
};