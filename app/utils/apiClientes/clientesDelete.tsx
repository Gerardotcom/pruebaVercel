export const deleteCliente = async (idCliente: number): Promise<boolean> => {
    try {
        const response = await fetch(`https://localhost:7014/api/cliente/${idCliente}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('No se pudo eliminar el cliente');
        }

        // Usa response.text() en lugar de response.json()
        const result = await response.text(); // Lee la respuesta como texto plano
        return true; // Devuelve true si la eliminación fue exitosa
    } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        return false; // Devuelve false si hubo un error
    }
};