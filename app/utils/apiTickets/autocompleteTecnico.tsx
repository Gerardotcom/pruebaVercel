import { useState } from "react";
import { asignarTecnico } from "./asignarTecnico";

interface Ticket {
    idTicket: number;
    descripcion: string;
}

interface Tecnico {
    idTecnico: number;
    nombre: string;
}

const EditTicketModal: React.FC<{ selectedTicket: Ticket; onClose: () => void }> = ({
    selectedTicket,
    onClose
}) => {
    const [tecnico, setTecnico] = useState("");
    const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);

    const buscarTecnicos = async (filtro: string) => {
        try {
            const response = await fetch(
                `https://localhost:7054/api/tickets/buscar-tecnicos?filtro=${filtro}`
            );
            if (!response.ok) throw new Error("Error al buscar técnicos");
            const data: Tecnico[] = await response.json();
            setTecnicos(data);
        } catch (error) {
            console.error("Error en la búsqueda de técnicos:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTecnico(value);
        if (value.trim()) {
            buscarTecnicos(value);
        } else {
            setTecnicos([]);
        }
    };

    const handleSeleccionarTecnico = async (nombreTecnico: string) => {
        try {
            await asignarTecnico(selectedTicket.idTicket, nombreTecnico);
            alert("Técnico asignado exitosamente");
            onClose();
        } catch (error) {
            console.error("Error al asignar técnico:", error);
            alert("Error al asignar técnico. Intenta de nuevo.");
        }
    };

    return (
        <div className="fixed inset-0 bg-sky-50 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h3 className="text-lg font-semibold text-black">Asignar Técnico</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        ✖️
                    </button>
                </div>

                <input
                    type="text"
                    value={tecnico}
                    onChange={handleInputChange}
                    placeholder="Buscar técnico..."
                    className="w-full p-2 border rounded-md mb-3"
                />

                {tecnicos.length > 0 && (
                    <ul className="border rounded-md overflow-hidden">
                        {tecnicos.map((tecnico) => (
                            <li
                                key={tecnico.idTecnico}
                                onClick={() => handleSeleccionarTecnico(tecnico.nombre)}
                                className="cursor-pointer p-2 hover:bg-gray-200"
                            >
                                {tecnico.nombre}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default EditTicketModal;
