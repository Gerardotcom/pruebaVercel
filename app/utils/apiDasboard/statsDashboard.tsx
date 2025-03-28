// statsDashboard.tsx
import { Ticket } from "../apiTickets/ticket";

const API_BASE_URL = 'https://localhost:7144/api/Dashboard';

export async function getEstadisticas() {
    const response = await fetch(`${API_BASE_URL}/estadisticas`);
    if (!response.ok) throw new Error('Error al obtener estadísticas');
    return await response.json();
}

export async function getTotalTickets(): Promise<number> {
    try {
        const response = await fetch(`${API_BASE_URL}/total-tickets`, {
            method: "GET"
        });

        if (!response.ok) throw new Error('Error al obtener total de tickets');

        const totalTickets = await response.json();

        // Verificamos que el dato recibido sea un número válido
        if (typeof totalTickets !== 'number') {
            throw new Error('Respuesta inesperada del servidor');
        }

        return totalTickets;
    } catch (error) {
        console.error("Error al obtener el total de tickets:", error);
        return 0; // En caso de error, devolvemos 0 para que no falle el componente
    }
}

export async function getMantenimientos() {
    const response = await fetch(`${API_BASE_URL}/mantenimientos`);
    if (!response.ok) throw new Error('Error al obtener mantenimientos');
    return await response.json();
}

export async function getEstados() {
    const response = await fetch(`${API_BASE_URL}/estados`);
    if (!response.ok) throw new Error('Error al obtener estados');
    return await response.json();
}

export interface TicketPorMes {
    idTicket: number;
    descripcion: string;
    nombreCliente: string;
    nombreTecnico: string;
    estado: string;
    fechaAlta: string;
}

export async function getTicketsPorMes(mes: number, anio: number): Promise<TicketPorMes[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/tickets-mes?mes=${mes}&anio=${anio}`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error('Error al obtener tickets por mes');
        }

        const tickets = await response.json();
        console.log("🔎 Respuesta completa de la API:", tickets); // 👈 Verifica la respuesta aquí

        if (!Array.isArray(tickets)) {
            throw new Error('Respuesta inesperada del servidor');
        }

        const ticketsNormalizados = tickets
            .filter(ticket => typeof ticket.FechaAlta === 'string')
            .map(ticket => ({
                idTicket: ticket.IdTicket,
                descripcion: ticket.Descripcion,
                nombreCliente: ticket.NombreCliente,
                nombreTecnico: ticket.NombreTecnico || "No asignado", // 👈 Valor por defecto
                estado: ticket.Estado || "Pendiente",                 // 👈 Valor por defecto
                fechaAlta: ticket.FechaAlta.split("T")[0]
            }));


        console.log("🎯 Tickets Normalizados:", ticketsNormalizados);

        return ticketsNormalizados;
    } catch (error) {
        console.error("Error al obtener tickets por mes:", error);
        return [];
    }
}

export const obtenerTickets = async (pageNumber: number = 1, pageSize: number = 10): Promise<{
    totalRegistros: number;
    paginaActual: number;
    totalPaginas: number;
    tickets: Ticket[];
}> => {
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