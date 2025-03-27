import { useState } from 'react';
import { Tecnico } from './tecnico';

const getAvailabilityColor = (disponibilidad: string): string => {
    switch (disponibilidad) {
        case "Disponible": return "bg-cyan-600";
        case "Ocupado": return "bg-blue-700";
        case "De baja": return "bg-slate-700";
        case "En descanso": return "bg-blue-400";
        default: return "bg-gray-500";
    }
};

const updateAvailability = async (idTecnico: number, nuevoEstado: string) => {
    try {
        console.log("Datos que se están enviando:", JSON.stringify(nuevoEstado)); // Para verificar el formato correcto

        const response = await fetch(`https://localhost:7177/api/tecnicos/estado/${idTecnico}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoEstado)  // Aquí se envía solo el string
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error del backend:", errorData);
            throw new Error("Error al actualizar el estado");
        }

        return true;
    } catch (error) {
        console.error("Error al actualizar el estado del técnico:", error);
        return false;
    }
};



interface DisponibilidadDropdownProps {
    tecnico: Tecnico;
    onEstadoActualizado: (idTecnico: number, nuevoEstado: string) => void;
}

const DisponibilidadDropdown: React.FC<DisponibilidadDropdownProps> = ({ tecnico, onEstadoActualizado }) => {
    const [estado, setEstado] = useState<string>(tecnico.estado);

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nuevoEstado = e.target.value;
        setEstado(nuevoEstado);

        const actualizado = await updateAvailability(tecnico.idTecnico, nuevoEstado);

        if (!actualizado) {
            alert("No se pudo actualizar el estado del técnico");
            setEstado(tecnico.estado);  // Restaurar el estado anterior si hay error
        } else {
            onEstadoActualizado(tecnico.idTecnico, nuevoEstado);
        }
    };
    return (
        <select
            value={estado}
            onChange={handleChange}
            className={`h-full w-full cursor-pointer rounded-md text-md text-white focus:outline-none ${getAvailabilityColor(estado)}`}
        >
            {["Disponible", "Ocupado", "De baja", "En descanso"].map((opcion) => (
                <option key={opcion} value={opcion} className="bg-slate-50 text-black focus:outline-none">
                    {opcion}
                </option>
            ))}
        </select>
    );
};

export default DisponibilidadDropdown;
