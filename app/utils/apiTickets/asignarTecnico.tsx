export const asignarTecnico = async (
    idTicket: number,
    nombreTecnico: string,
    confirmacionForzada: boolean = true
) => {
    const token = localStorage.getItem('token'); // Obtén el token del almacenamiento local

    try {
        const response = await fetch(`https://localhost:7054/api/tickets/asignar-tecnico/${idTicket}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 🔥 Añade el token aquí
            },
            body: JSON.stringify({
                NombreTecnico: nombreTecnico,
                ConfirmacionForzada: confirmacionForzada
            })
        });

        if (!response.ok) {
            // Verificar si el cuerpo de la respuesta está vacío antes de intentar convertirlo en JSON
            const errorText = await response.text();
            const errorData = errorText ? JSON.parse(errorText) : {};
            throw new Error(errorData.message || 'Error al asignar técnico');
        }

        // Verificar si la respuesta tiene contenido antes de parsear
        const responseBody = await response.text();
        return responseBody ? JSON.parse(responseBody) : {}; // Evita el error de JSON vacío
    } catch (error) {
        console.error('Error al asignar técnico:', error);
        throw error;
    }
};
