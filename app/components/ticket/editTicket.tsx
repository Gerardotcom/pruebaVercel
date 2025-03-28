import { useState, useEffect } from "react";
import { X } from 'lucide-react';
import { Ticket } from '~/utils/apiTickets/ticket';
import { asignarTecnico } from "~/utils/apiTickets/asignarTecnico";

interface EditTicketProps {
    ticket: Ticket;
    onClose: () => void;
    onAssignTechnician: (ticketId: number, tecnico: string) => void;
}

interface Tecnico {
    idTecnico: number;
    nombreTecnico: string;
}

export const EditTicketModal: React.FC<EditTicketProps> = ({ ticket, onClose, onAssignTechnician }) => {
    const [nombreTecnico, setNombreTecnico] = useState(ticket.nombreTecnico || '');
    const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Función para buscar técnicos
    const buscarTecnicos = async (filtro: string) => {
        const token = localStorage.getItem('token');
    
        try {
            const response = await fetch(
                `https://localhost:7054/api/tickets/buscar-tecnicos?filtro=${filtro}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            if (!response.ok) throw new Error("Error al buscar técnicos");
    
            const data = await response.json();
            console.log("Respuesta del API:", data);  // 🔎 Inspecciona la estructura de los datos
            setTecnicos(data);  // Ajusta esto según la estructura real de la respuesta
        } catch (error) {
            console.error("Error en la búsqueda de técnicos:", error);
            setTecnicos([]);
        }
    };  


    // Manejador de cambio en el input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNombreTecnico(value);
        if (value.trim()) {
            buscarTecnicos(value);  // Buscar técnicos mientras se escribe
        } else {
            setTecnicos([]);
        }
    };

    // Asignar técnico al ticket
    const handleAssignTechnician = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            await asignarTecnico(ticket.idTicket, nombreTecnico);
            onAssignTechnician(ticket.idTicket, nombreTecnico);
            onClose();
        } catch (error) {
            setErrorMessage('Hubo un error al asignar el técnico. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // Manejar la selección de un técnico de la lista
    const handleSeleccionarTecnico = (nombre: string) => {
        setNombreTecnico(nombre);
        setTecnicos([]);  // Limpiar sugerencias tras seleccionar
    };

    return (
        <div className="fixed inset-0 bg-slate-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-md max-w-lg w-full">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h3 className="text-lg font-semibold text-black">Asignar Técnico</h3>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleAssignTechnician}>
                    {/* Información del ticket */}
                    <div className="mb-3">
                        <label className="block text-sm text-black capitalize">Problema</label>
                        <input
                            type="text"
                            value={ticket.descripcion}
                            readOnly
                            className="bg-transparent text-black w-full p-2 border rounded-md cursor-not-allowed"
                        />
                    </div>

                    {/* Input para buscar técnicos */}
                    <div className="mb-3">
                        <label className="block text-sm text-black capitalize">Asignar Técnico</label>
                        <input
                            type="text"
                            value={nombreTecnico}
                            onChange={handleInputChange}
                            className="bg-transparent text-black w-full p-2 border rounded-md"
                            placeholder="Escribe para buscar..."
                        />

                        {/* Lista de sugerencias */}
                        {tecnicos.length > 0 && (
                            <ul className="absolute border rounded-xl bg-white shadow-md mt-1 max-h-40 min-w-40 max-w-60 overflow-y-auto">
                                {tecnicos.map((tecnico) => (
                                    <li
                                        key={tecnico.idTecnico}
                                        onClick={() => handleSeleccionarTecnico(tecnico.nombreTecnico)}
                                        className="text-black cursor-pointer p-2 hover:bg-sky-50"
                                    >
                                        {tecnico.nombreTecnico}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Mensaje de error */}
                    {errorMessage && (
                        <div className="text-red-500 text-sm mb-3">{errorMessage}</div>
                    )}

                    {/* Botón para asignar técnico */}
                    <button
                        type="submit"
                        className="w-full bg-primary font-medium text-white p-2 rounded-lg mt-3"
                        disabled={loading}
                    >
                        {loading ? "Asignando..." : "Asignar Técnico"}
                    </button>
                </form>
            </div>
        </div>
    );
};
