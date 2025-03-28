import { useEffect, useState } from "react";
import { getEstados } from '~/utils/apiDasboard/statsDashboard';
import { Link } from "@remix-run/react";
import { DynamicIcon } from "../dynamicIcons";

const TicketDashboard = () => {
    const [ticketCounts, setTicketCounts] = useState({
        Resuelto: 0,
        Abierto: 0,
        "En Proceso": 0,
        Cerrado: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getEstados();
                setTicketCounts({
                    Resuelto: data.resueltos || 0,
                    Abierto: data.abiertos || 0,
                    "En Proceso": data.enProceso || 0,
                    Cerrado: data.cancelados || 0
                });
            } catch (error) {
                console.error("Error al obtener datos de estados:", error);
            }
        };

        fetchData();
    }, []);

    const priorities = [
        { label: "Resueltos", count: ticketCounts.Resuelto, color: "bg-blue-700 text-white" },
        { label: "Abiertos", count: ticketCounts.Abierto, color: "bg-[#55c6da] text-white" },
        { label: "En proceso", count: ticketCounts["En Proceso"], color: "bg-[#3e8fd8] text-white" },
        { label: "Cerrados", count: ticketCounts.Cerrado, color: "bg-slate-700 text-white" },
    ];

    return (
        <div className="w-80 max-w-lg mx-auto rounded-3xl shadow-md p-4 bg-white">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4">
                {priorities.map((priority, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div
                            className={`w-12 h-12 flex items-center justify-center rounded-full text-base font-bold ${priority.color}`}
                        >
                            {priority.count}
                        </div>
                        <span className="text-xs text-gray-600 text-center mt-2">{priority.label}</span>
                    </div>
                ))}
            </div>
            <Link to="/Tickets" className="w-full flex justify-between bg-blue-700 text-white p-3 rounded-xl">
                <div className="flex">
                <DynamicIcon iconName="TicketCheck" className="w-6 h-6" />
                    <span>Tickets</span>
                </div>
                <DynamicIcon iconName="ChevronRight" className="w-6 h-6" />
            </Link>
        </div>
    );
};

export default TicketDashboard;
