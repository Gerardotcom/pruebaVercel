import React, { useState, useEffect } from "react";
import { getTicketsPorMes, TicketPorMes } from "~/utils/apiDasboard/statsDashboard";

interface CalendarProps { }

export function Calendar({ }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<number | null>(null);
  const [tickets, setTickets] = useState<TicketPorMes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // Obtener tickets del mes
  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError(null);
      try {
        const mes = currentDate.getMonth() + 1; // Enero es 0, por eso sumamos 1
        const anio = currentDate.getFullYear();
        const data = await getTicketsPorMes(mes, anio);
        setTickets(data);
      } catch (error) {
        setError("Error al obtener los tickets del mes");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [currentDate]);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const changeMonth = (direction: string) => {
    let newDate = new Date(currentDate);
    newDate.setMonth(direction === "next" ? newDate.getMonth() + 1 : newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const daysInMonth = getDaysInMonth(currentDate.getMonth(), currentDate.getFullYear());
  const firstDayOfMonth = getFirstDayOfMonth(currentDate.getMonth(), currentDate.getFullYear());

  const today = new Date();
  const isToday = (day: number) => (
    today.getDate() === day &&
    today.getMonth() === currentDate.getMonth() &&
    today.getFullYear() === currentDate.getFullYear()
  );

  const ticketsByDate = tickets.reduce((acc, ticket) => {
    const ticketDate = new Date(ticket.fechaAlta + "T00:00:00"); // 👈 Corregido aquí

    const normalizedDate = new Date(
      ticketDate.getFullYear(),
      ticketDate.getMonth(),
      ticketDate.getDate()
    );

    if (
      normalizedDate.getMonth() === currentDate.getMonth() &&
      normalizedDate.getFullYear() === currentDate.getFullYear()
    ) {
      const day = normalizedDate.getDate();
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(ticket);
    }
    return acc;
  }, {} as Record<number, TicketPorMes[]>);

  return (
    <div className="bg-white shadow-lg rounded-3xl p-5 w-80 md:max-w-sm lg:max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth("prev")} className="p-2">
          <span className="text-blue-500">&#8249;</span>
        </button>
        <h2 className="text-lg font-semibold text-black">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button onClick={() => changeMonth("next")} className="p-2">
          <span className="text-blue-500">&#8250;</span>
        </button>
      </div>
      <div className="grid grid-cols-7 grid-rows-6 text-center font-medium text-gray-700 text-sm min-h-[220px]">
        {["D", "L", "M", "M", "J", "V", "S"].map(day => (
          <div key={day} className="p-1">{day}</div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="p-2"></div>
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
          <div
            key={day}
            className={`relative p-2 text-sm rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition
              ${isToday(day) ? "bg-blue-500 text-white" : "hover:bg-gray-200"}
              ${ticketsByDate[day] ? "border border-blue-500" : ""}
            `}
            onMouseEnter={() => setHoveredDate(day)}
            onMouseLeave={() => setHoveredDate(null)}
          >
            {day}
            {ticketsByDate[day] && (
              <div
                className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full
                ${isToday(day) ? "bg-white" : ""}`}
              ></div>
            )}


            {hoveredDate === day && ticketsByDate[day] && (
              <div className="max-h-[16rem] absolute top-1/2 left-0 transform -translate-x-full -translate-y-1/2 bg-white z-50 text-black shadow-lg rounded-lg text-xs w-60 h-fit border border-gray-300 overflow-y-auto">
                <h3 className="p-2 font-bold text-sm mb-1 sticky top-0 bg-white shadow-md">Tickets</h3>
                <ul className="px-2 pt-2">
                  {ticketsByDate[day].map((ticket, index) => (
                    <li key={ticket.idTicket} className={`p-2 rounded-md mb-2 ${index % 2 === 0 ? "bg-slate-100" : "bg-slate-200/80"}`}>
                      <span className="font-semibold text-gray-700">ID:</span> {ticket.idTicket}<br />
                      <span className="font-semibold text-gray-700">Problema:</span> {ticket.descripcion}<br />
                      <span className="font-semibold text-gray-700">Cliente:</span> {ticket.nombreCliente}<br />
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}
