export const cambiarEstado = async (
    idTicket: number,
    nuevoEstado: string
) => {
    const token = localStorage.getItem('token'); // Obtener el token de autenticación

    try {
        const response = await fetch(`https://localhost:7054/api/tickets/cambiar-estado/${idTicket}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 🔥 Agrega el token aquí
            },
            body: JSON.stringify(nuevoEstado) // El body solo debe contener el string
        });

        if (!response.ok) {
            const errorText = await response.text();
            const errorData = errorText ? JSON.parse(errorText) : {};
            throw new Error(errorData.message || 'Error al cambiar el estado del ticket');
        }

        const responseBody = await response.text();
        return responseBody ? JSON.parse(responseBody) : {}; // Evita error de JSON vacío
    } catch (error) {
        console.error('Error al cambiar estado del ticket:', error);
        throw error;
    }
};
