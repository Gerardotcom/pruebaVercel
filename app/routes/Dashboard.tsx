import { useState } from "react";
import withAuth from "~/utils/apiLogin/auth";
import { Sidebar } from "~/components/sidebar";
import { Navbar } from "~/components/navbar";
import RecentTickets from "~/components/dashboard/ticketsrecientes";
import TicketCounter from "~/components/dashboard/ticketCounter";
import { Calendar } from "~/components/dashboard/calendario";
import TicketDashboard from "~/components/dashboard/contadortickets";
import { ticketsData } from "~/utils/tickatsData";

function DashboardLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [tickets, setTickets] = useState(ticketsData);  // Usas los datos importados
  const [currentPage, setCurrentPage] = useState(1); // Paginación
  const itemsPerPage = 5;
  const pageTitle = "Dashboard";
  const filteredTickets = tickets.filter((ticket) =>
    ticket.problema.toLowerCase().includes(search.toLowerCase()) ||
    ticket.cliente.toLowerCase().includes(search.toLowerCase()) ||
    ticket.asset.toLowerCase().includes(search.toLowerCase()) ||
    ticket.tecnico.toLowerCase().includes(search.toLowerCase())
  );
  const sortedTickets = [...filteredTickets].sort((a, b) => { // Ordenar
    const dateA = new Date(a.fecha).getTime();
    const dateB = new Date(b.fecha).getTime();
    return sortAsc ? dateA - dateB : dateB - dateA;
  });
  const totalPages = Math.max(Math.ceil(sortedTickets.length / itemsPerPage), 1); // Cálculo paginación
  const currentTickets = sortedTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const toggleSortOrder = () => {
    setSortAsc(!sortAsc);
  };
  const handleStatusChange = (ticketId: number, newStatus: string) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    );
  };
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="w-screen h-screen flex bg-sky-50 overflow-hidden">
      <Sidebar sidebarVisible={sidebarVisible} toggleSidebar={() => setSidebarVisible(!sidebarVisible)} />
      <main className="w-full h-full flex-1 flex flex-col overflow-x-auto">
        <Navbar toggleSidebar={toggleSidebar} title={pageTitle} />
        <div className="flex h-full max-w-full">
          <div className="h-full w-full p-4 overflow-x-auto">
            <RecentTickets
              search={search}
              setSearch={setSearch}
              sortAsc={sortAsc}
              toggleSortOrder={toggleSortOrder}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage} sidebarOpen={false} />
          </div>
          <aside className="h-full w-lg py-4 pr-4">
            <RightPanel />
          </aside>
        </div>
      </main>
    </div>
  );
}
function RightPanel() {
  return (
    <div className="flex flex-col justify-between h-full w-full space-y-4">
      <TicketDashboard />
      {/*componente Calendar  */}
      <Calendar/>
      <TicketCounter />

    </div>
  );
}

export default withAuth(DashboardLayout);

function getNextStatus(currentStatus: string) {
  // Función auxiliar para cambiar el status
  switch (currentStatus) {
    case "Abierto":
      return "En Proceso";
    case "En Proceso":
      return "Cerrado";
    case "Cerrado":
      return "Resuelto";  // Nuevo estado agregado
    case "Resuelto":  // Caso para volver al inicio
      return "Abierto";
    default:
      return "Abierto";
  }
}

