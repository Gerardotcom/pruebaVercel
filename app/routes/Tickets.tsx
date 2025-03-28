import { useState, useEffect } from "react";
import withAuth from "~/utils/apiLogin/auth";
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Files, Plus, X, Pencil, Trash2 } from "lucide-react";
import { Sidebar } from "~/components/sidebar";
import { Navbar } from "~/components/navbar";
import { Ticket } from "~/utils/apiTickets/ticket";
import { EditTicketModal } from "~/components/ticket/editTicket";
import { getTickets } from "~/utils/apiTickets/ticketsGet";
import { crearTicket } from "~/utils/apiTickets/apiCrearTicket";
import { asignarTecnico } from "~/utils/apiTickets/asignarTecnico";
import { cambiarEstado } from "~/utils/apiTickets/estadosTicket";


function TicketsLayout() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [search, setSearch] = useState("");
    const [sortAsc, setSortAsc] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isAddingTicket, setIsAddingTicket] = useState(false);
    const [isEditingTicket, setIsEditingTicket] = useState(false);
    const [modalOpen, setModalOpen] = useState(false)
    const [nombreTecnico, setNombreTecnico] = useState<string>("");
    const estados = ["Pendiente", "En proceso", "Resuelto", "Cancelado"];



    // Estado para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 5;

    // Obtener tickets desde la API
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const data = await getTickets(currentPage, itemsPerPage);
                setTickets(data.tickets);
                setTotalPages(data.totalPaginas);
            } catch (error) {
                console.error("Error al obtener tickets:", error);
            }
        };

        fetchTickets();
    }, [currentPage]);

    const handleAssignTechnician = (ticketId: number, nombreTecnico: string) => {
        // Actualizar el ticket con el técnico asignado
        setTickets((prevTickets) =>
            prevTickets.map((ticket) =>
                ticket.idTicket === ticketId ? { ...ticket, tecnico: nombreTecnico } : ticket
            )
        );
    };


    const renderPaginationButtons = () => {
        const buttons = [];
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(startPage + 4, totalPages);

        for (let page = startPage; page <= endPage; page++) {
            buttons.push(
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-[2rem] py-1 rounded ${currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                >
                    {page}
                </button>
            );
        }

        return buttons;
    };

    // Filtrar tickets según la búsqueda
    const filteredTickets = tickets.filter((ticket) =>
        ticket.nombreCliente?.toLowerCase().includes(search.toLowerCase())
    );

    // Ordenar tickets por ID
    const sortedTickets = [...filteredTickets].sort((a, b) =>
        sortAsc ? a.idTicket - b.idTicket : b.idTicket - a.idTicket
    );

    // Cambiar a la página siguiente
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Cambiar a la página anterior
    const previousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Alternar orden ascendente/descendente
    const toggleSortOrder = () => {
        setSortAsc(!sortAsc);
    };

    // Alternar la visibilidad de la barra lateral
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    return (
        <div className="w-screen h-screen flex bg-sky-50">
            {/* Sidebar */}
            <Sidebar sidebarVisible={sidebarVisible} toggleSidebar={toggleSidebar} />

            {/* Contenido principal */}
            <main className="flex-1 flex flex-col h-full w-full overflow-hidden">
                {/* Navbar */}
                <Navbar toggleSidebar={toggleSidebar} title="Tickets" />

                {/* Contenido principal */}
                <div className=" flex h-full w-full p-4 md:p-6 ">
                    {/* Tabla */}
                    <div className="h-full w-full flex flex-col justify-between bg-white shadow-md rounded-3xl p-6 ">
                        {/* Encabezado de la tabla */}
                        <div className="flex flex-col h-full overflow-x-auto">
                            <div className="flex justify-between items-center mb-4 select-none sticky left-0">
                                <div className="w-full flex justify-between items-center mb-4 select-none sticky left-0">
                                    <div>
                                        <h1 className="text-2xl font-bold text-black">Tickets</h1>
                                        <p className="text-sm text-blue-500">Gestión de tickets</p>
                                    </div>

                                    {/* Barra de búsqueda y botón de ordenar */}
                                    <div className="flex space-x-4">
                                        {/* Botón para agregar un nuevo ticket */}
                                        <button
                                            className="h-10 w-10 flex items-center bg-primary text-black p-2 rounded-full space-x-2"
                                            onClick={() => setIsAddingTicket(true)}
                                        >
                                            <Plus className="w-6 h-5 text-white" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Tabla de tickets */}
                            <table className="w-full h-fit text-left text-sm border-collapse">
                                <thead>
                                    <tr className=" border-b border-gray-200 bg-gray-100 text-black uppercase leading-normal">
                                        <th className="bg-gray-100 py-3 px-6 sticky left-0">ID</th>
                                        <th className="py-3 px-6">Problema</th>
                                        <th className="py-3 px-6">Cliente</th>
                                        <th className="py-3 px-6">Assests</th>
                                        <th className="py-3 px-6">Tecnico</th>
                                        <th className="py-3 px-6">Status</th>
                                        <th className="py-3 px-6">Tipo</th>
                                        <th className="py-3 px-6">Prioridad</th>
                                        <th className="py-3 px-6">Fecha</th>
                                        <th className="py-3 px-6">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tickets.map((ticket) => (
                                        <tr key={ticket.idTicket} className="border-b border-gray-200 hover:bg-sky-50">
                                            <td className="bg-white py-3 px-6 text-blue-500 sticky left-0">{ticket.idTicket}</td>
                                            <td className="py-3 px-6 text-black truncate max-w-[8rem]">{ticket.descripcion}</td>
                                            <td className="py-3 px-6 text-black truncate max-w-[8rem]">{ticket.nombreCliente}</td>
                                            <td className="py-3 px-6 text-black truncate max-w-[8rem]">{ticket.nombreAsset}
                                            </td>
                                            <td className="py-3 px-6 text-black truncate max-w-[10rem]">{ticket.nombreTecnico}</td>
                                            <td className="py-2 px-1 md:px-4 text-black">
                                                <div
                                                    className={`w-[7rem] px-2 py-1 rounded-md ${ticket.estado === "Abierto" ? "bg-cyan-600 text-white" :
                                                        ticket.estado === "En proceso" ? "bg-[#3e8fd8] text-white" :
                                                            ticket.estado === "Cerrado" ? "bg-slate-700 text-white" :
                                                                ticket.estado === "Resuelto" ? "bg-blue-700 text-white" :
                                                                    "bg-gray-300 text-gray-800"
                                                        }`}
                                                >
                                                    <select
                                                        value={ticket.estado}
                                                        onChange={async (e) => {
                                                            const nuevoEstado = e.target.value;
                                                            try {
                                                                await cambiarEstado(ticket.idTicket, nuevoEstado);
                                                                alert(`Estado del ticket actualizado a "${nuevoEstado}"`);
                                                            } catch (error) {
                                                                console.error('Error al cambiar estado del ticket:', error);
                                                                alert('Hubo un error al cambiar el estado del ticket.');
                                                            }
                                                        }}
                                                        className="bg-transparent w-full focus:outline-none cursor-pointer"
                                                    >
                                                        {["Abierto", "En proceso", "Resuelto", "Cancelado"].map((estado) => (
                                                            <option
                                                                key={estado}
                                                                value={estado}
                                                                className="text-black" // Evita que el texto del dropdown adopte el color del fondo
                                                            >
                                                                {estado}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-black">{ticket.tipoMantenimiento}</td>
                                            <td className="py-3 px-6 text-black">
                                                <button className={`px-2 py-1 rounded-md focus:outline-none ${ticket.prioridad === "Baja" ? "bg-green-600 text-white" : ticket.prioridad === "Media" ? "bg-yellow-600 text-white" : ticket.prioridad === "Alta" ? "bg-red-600 text-white" :
                                                    ticket.prioridad === "Critica" ? "bg-slate-700 text-white" : "bg-gray-300 text-gray-800"}`}>
                                                    {ticket.prioridad}
                                                </button>
                                            </td>
                                            <td className="py-3 px-6 text-black truncate max-w-[10rem]">{ticket.fechaAlta}</td>
                                            <td className="py-3 px-6 text-center">
                                                <button
                                                    onClick={() => setSelectedTicket(ticket)}
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    <Pencil className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Controles de paginación */}
                        <div className="flex justify-center md:justify-end mt-4 space-x-2">
                            {/* Botón "Anterior" */}
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 bg-gray-200 text-black rounded disabled:opacity-50"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {/* Botones de paginación numéricos */}
                            {renderPaginationButtons()}

                            {/* Botón "Siguiente" */}
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 bg-gray-200 text-black rounded disabled:opacity-50"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal para agregar */}
                {(isAddingTicket) && (
                    <div className="fixed inset-0 bg-slate-800 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-3xl shadow-xl max-w-sm w-full">
                            <div className="flex justify-between items-center border-b pb-2 mb-4">
                                <h3 className="text-lg font-semibold text-black">
                                    {isAddingTicket ? "Agregar Ticket" : "Editar Ticket"}
                                </h3>
                                <button
                                    onClick={() => {
                                        setSelectedTicket(null);
                                        setIsAddingTicket(false);
                                    }}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();

                                    const formData = new FormData(e.target as HTMLFormElement);
                                    const ticketData = {
                                        Descripcion: formData.get("problema") as string, // <-- Cambio clave aquí
                                        IdCliente: Number(formData.get("cliente")),
                                        IdAsset: Number(formData.get("assets")),
                                        TipoMantenimiento: formData.get("tipo") as string,
                                        Prioridad: formData.get("prioridad") as string,
                                    };

                                    console.log("Datos enviados:", ticketData); // <-- Verifica los datos antes de enviar

                                    try {
                                        const nuevoTicket = await crearTicket(ticketData);
                                        alert("Ticket creado exitosamente");
                                        setSelectedTicket(null);
                                        setIsAddingTicket(false);
                                    } catch (error) {
                                        console.error("Error en la creación del ticket:", error);
                                        alert("Error al crear el ticket. Intenta de nuevo.");
                                    }
                                }}
                            >
                                {[
                                    { label: "Problema", name: "problema", type: "text" },
                                    { label: "Cliente", name: "cliente", type: "text" },
                                    { label: "Assets", name: "assets", type: "text" },
                                    { label: "Tipo de mantenimiento", name: "tipo", type: "dropdown", options: ["Correctivo", "Preventivo"] }, // Dropdown para Tipo
                                    { label: "Prioridad", name: "prioridad", type: "dropdown", options: ["Baja", "Media", "Alta", "Critica"] }, // Dropdown para Prioridad
                                ].map(({ label, name, type, options }) => (
                                    <div key={name} className="mb-3">
                                        <label className="block text-sm text-black capitalize">{label}</label>
                                        {type === "dropdown" ? (
                                            // Renderizar un dropdown si el tipo es "dropdown"
                                            <select
                                                name={name}
                                                defaultValue={selectedTicket ? selectedTicket[name as keyof Ticket] || "" : ""}
                                                className="bg-transparent text-black w-full p-2 border rounded-md"
                                            >
                                                <option value="">Seleccione una opción</option>
                                                {options?.map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            // Renderizar un input de texto para otros tipos
                                            <input
                                                type="text"
                                                name={name}
                                                defaultValue={selectedTicket ? selectedTicket[name as keyof Ticket] || "" : ""}
                                                className="bg-transparent text-black w-full p-2 border rounded-md"
                                            />
                                        )}
                                    </div>
                                ))}
                                <button type="submit" className="w-full bg-primary font-medium text-white p-2 rounded-md mt-3">
                                    {isAddingTicket ? "Agregar" : "Guardar"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
                {selectedTicket && (
                    <EditTicketModal
                        ticket={selectedTicket}
                        onClose={() => setSelectedTicket(null)}  // Cerrar modal
                        onAssignTechnician={handleAssignTechnician}
                    />
                )}

            </main>
        </div>
    );
}

export default withAuth(TicketsLayout);
