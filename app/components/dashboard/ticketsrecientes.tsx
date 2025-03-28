import { useEffect, useState } from "react";
import { obtenerTickets, getMantenimientos } from "~/utils/apiDasboard/statsDashboard";
import { Ticket } from "~/utils/apiTickets/ticket";
import { ChevronLeft, ChevronRight } from "lucide-react";

type RecentTicketsProps = {
  search: string;
  setSearch: (value: string) => void;
  sortAsc: boolean;
  toggleSortOrder: () => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  sidebarOpen: boolean;
};

const RecentTickets = ({
  search,
  setSearch,
  sortAsc,
  toggleSortOrder,
  currentPage,
  setCurrentPage,
  sidebarOpen
}: RecentTicketsProps) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [correctivos, setCorrectivos] = useState(0);
  const [preventivos, setPreventivos] = useState(0);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { tickets, totalPaginas, paginaActual } = await obtenerTickets(currentPage, 5);
        setTickets(tickets);
        setTotalPages(totalPaginas);
        setCurrentPage(paginaActual);
      } catch (error) {
        console.error("Error al obtener tickets:", error);
      }
    };

    const fetchMantenimientos = async () => {
      try {
        const { correctivos, preventivos } = await getMantenimientos();
        setCorrectivos(correctivos);
        setPreventivos(preventivos);
      } catch (error) {
        console.error("Error al obtener mantenimientos:", error);
      }
    };

    fetchTickets();
    fetchMantenimientos();
  }, [currentPage]);

  const renderPaginationButtons = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 rounded ${currentPage === i ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="h-full w-full flex flex-col justify-between bg-white shadow-md rounded-3xl p-4">
      <div className="h-full w-full">
        <div className="flex flex-col h-full overflow-x-auto">
          <div className="flex flex-col mb-4 select-none sticky left-0">
            <h2 className="w-full text-center text-2xl font-semibold text-black my-2">Tickets Recientes</h2>
          </div>

          <table className="min-w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="min-w-full bg-gray-100 text-black uppercase leading-normal text-xs md:text-sm">
                <th className="py-2 px-1 pl-2 md:px-4 sticky left-0 bg-gray-100">ID</th>
                <th className="py-2 px-1 md:px-4">Problema</th>
                <th className="py-2 px-1 md:px-4">Cliente</th>
                <th className="py-2 px-1 md:px-4">Assets</th>
                <th className="py-2 px-1 md:px-4">Técnico</th>
                <th className="py-2 px-1 md:px-4 max-w-[8rem]">estado</th>
                <th className="py-2 px-1 md:px-4 hidden md:table-cell">Tipo</th>
                <th className="py-2 px-1 md:px-4 hidden md:table-cell">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.idTicket} className="min-w-full border-b border-gray-200 my-10 hover:bg-blue-50">
                  <td className="py-2 px-1 pl-2 md:px-4 text-blue-500 sticky left-0 bg-white">{ticket.idTicket}</td>
                  <td className="py-2 px-1 md:px-4 text-black truncate max-w-[8rem] md:max-w-none">{ticket.descripcion}</td>
                  <td className="py-2 px-1 md:px-4 text-black truncate max-w-[8rem] md:max-w-none">{ticket.nombreCliente}</td>
                  <td className="py-2 px-1 md:px-4 text-black truncate max-w-[8rem] md:max-w-none">{ticket.nombreAsset}</td>
                  <td className="py-2 px-1 md:px-4 text-black truncate max-w-[8rem] md:max-w-none">{ticket.nombreTecnico}</td>
                  <td className="py-2 px-1 md:px-4 text-black">
                    <button className={`px-2 py-1 rounded-md w-[6rem] ${ticket.estado === "Abierto" ? "bg-cyan-600 text-white" :
                      ticket.estado === "En proceso" ? "bg-[#3e8fd8] text-white" :
                        ticket.estado === "Cerrado" ? "bg-slate-700 text-white" :
                          ticket.estado === "Resuelto" ? "bg-blue-700 text-white" : "bg-gray-300 text-gray-800"
                      }`}>
                      {ticket.estado}
                    </button>
                  </td>
                  <td className="py-2 px-1 md:px-4 hidden md:table-cell text-black">{ticket.tipoMantenimiento}</td>
                  <td className="py-2 px-1 md:px-4 hidden md:table-cell truncate max-w-[8rem] text-black">{ticket.fechaAlta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center mt-6">
        <div className="flex items-center space-x-4 text-black">
          <div className="flex items-center">
            <span className="w-6 h-6 bg-slate-700 rounded-full text-white text-sm flex items-center justify-center mr-2">{correctivos}</span>
            Correctivos
          </div>
          <div className="flex items-center">
            <span className="w-6 h-6 bg-blue-700 rounded-full text-white text-sm flex items-center justify-center mr-2">{preventivos}</span>
            Preventivos
          </div>
        </div>
      </div>
      <div className="flex justify-center md:justify-end mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 text-black rounded disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {renderPaginationButtons()}

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 text-black rounded disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default RecentTickets;
