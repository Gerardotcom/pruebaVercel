import { Ticket } from "./ticket";

// Definir la interfaz ApiResponse
export interface ApiResponse {
    totalRegistros: number;
    paginaActual: number;
    totalPaginas: number;
    tickets: Ticket[];
}

export const getTickets = async (pageNumber: number = 1, pageSize: number = 10): Promise<ApiResponse> => {
    try {
        const response = await fetch(`https://localhost:7054/api/Tickets/mis-tickets?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}` // Si tu API requiere autenticación
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener tickets: ${response.statusText}`);
        }

        const data = await response.json();

        // Calcular el total de páginas
        const totalPaginas = Math.ceil(data.totalRegistros / pageSize);

        return {
            totalRegistros: data.totalRegistros,
            paginaActual: pageNumber,
            totalPaginas: totalPaginas,
            tickets: data.tickets
        };
    } catch (error) {
        console.error("Error al obtener los tickets:", error);
        throw error;
    }
};
