import { useEffect, useState } from "react";
import withAuth from "~/utils/apiLogin/auth";
import { ChevronLeft, ChevronRight, Files, X, Pencil, Trash2 } from "lucide-react";
import { Sidebar } from "~/components/sidebar";
import { Navbar } from "~/components/navbar";
import { Cliente } from "~/utils/apiClientes/cliente";
import { getClientes } from "~/utils/apiClientes/clientesGet";
import { editCliente } from "~/utils/apiClientes/clientesEdit";
import { deleteCliente } from "~/utils/apiClientes/clientesDelete";
import { Modal } from "~/components/Modal";

type ClienteKeys = keyof Cliente;

function ClientesLayout() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteClienteId, setDeleteClienteId] = useState<number | null>(null);
  const [deleteClienteName, setDeleteClienteName] = useState<string>("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"confirm" | "alert">("confirm");
  const pageTitle = "Clientes";

  // Obtener los clientes
  const fetchClientes = async () => {
    try {
      const response = await getClientes(currentPage, pageSize);
      console.log("Respuesta de la API:", response);

      const { clientes, totalRecords } = response;
      console.log("Total de registros:", totalRecords);
      console.log("Tamaño de página (pageSize):", pageSize);

      if (typeof totalRecords !== "number" || totalRecords <= 0) {
        throw new Error("El total de registros no es un número válido.");
      }
      if (typeof pageSize !== "number" || pageSize <= 0) {
        throw new Error("El tamaño de página no es un número válido.");
      }

      setClientes(clientes);
      setTotalPages(Math.ceil(totalRecords / pageSize));
    } catch (error) {
      console.error("Error al obtener técnicos:", error);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, [currentPage]);

  // Paginación
  const previousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let page = Math.max(1, currentPage - 2); page <= Math.min(currentPage + 2, totalPages); page++) {
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

  // Editar cliente
  const handleAddOrEditCliente = async (id: number, clienteData: any) => {
    try {
      const result = await editCliente(id, clienteData);
      alert(result.message);
      setSelectedCliente(null);
      fetchClientes();
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      alert("Hubo un error al actualizar el cliente.");
    }
  };

  // Función para manejar la eliminación de un cliente
  const handleDeleteCliente = (idCliente: number, nombreCliente: string, ticketsAsignados: string | number) => {
    setDeleteClienteId(idCliente);
    setDeleteClienteName(nombreCliente);
    setModalType("confirm"); // Inicia como modal de confirmación

    // Convertimos ticketsAsignados a número
    const tickets = Number(ticketsAsignados);

    if (isNaN(tickets) || tickets <= 0) {
      // Si no tiene tickets activos, permitir eliminación
      setModalMessage(`¿Seguro que quieres eliminar al cliente "${nombreCliente}"?`);
    } else {
      // Si tiene tickets activos, mostrar alerta
      setModalMessage(`El cliente "${nombreCliente}" tiene tickets activos y no puede ser eliminado.`);
      setModalType("alert"); // Modo alerta si no se puede eliminar
    }

    setIsDeleteModalOpen(true);
  };

  // Función para confirmar la eliminación
  const handleConfirmDelete = async () => {
    if (deleteClienteId) {
      const success = await deleteCliente(deleteClienteId);
      if (success) {
        // Cliente eliminado correctamente
        setModalMessage(`Se eliminó el cliente "${deleteClienteName}" exitosamente.`);
      } else {
        // No se pudo eliminar porque tiene tickets activos
        setModalMessage(`El cliente "${deleteClienteName}" no se puede eliminar porque tiene tickets activos.`);
      }
      setModalType("alert"); // Cambiar modal a alerta
      setIsDeleteModalOpen(true);
    }
  };

  // Función para cancelar la eliminación
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
  };


  // Filtrar y ordenar clientes
  const filteredClientes = clientes.filter((cliente) =>
    cliente.idCliente?.toString().includes(search) ||
    cliente.nombreCliente.toLowerCase().includes(search.toLowerCase()) ||
    cliente.correo.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSortOrder = () => {
    setSortAsc(!sortAsc);
  };

  const sortedClientes = [...filteredClientes].sort((a, b) =>
    sortAsc ? a.idCliente - b.idCliente : b.idCliente - a.idCliente
  );

  const copyToClipboard = (correo: string) => {
    navigator.clipboard.writeText(correo);
  };

  return (
    <div className="w-screen h-screen flex bg-sky-50">
      <Sidebar sidebarVisible={sidebarVisible} toggleSidebar={() => setSidebarVisible(!sidebarVisible)} />

      <main className="flex flex-col h-full w-full">
        <Navbar toggleSidebar={() => setSidebarVisible(!sidebarVisible)} title={pageTitle} />

        <div className="flex h-full p-4 md:p-6 overflow-hidden">
          {/* Tabla */}
          <div className="flex flex-col justify-between bg-white h-full w-full shadow-md rounded-3xl p-6 overflow-x-auto">
            {/* Encabezado de la tabla */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-4 select-none">
                <div>
                  <h1 className="text-2xl font-bold text-black">Clientes</h1>
                  <p className="text-sm text-blue-500">Gestión de clientes</p>
                </div>
              </div>

              {/* Tabla de clientes */}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-black uppercase text-sm leading-normal">
                    <th className="p-3">ID</th>
                    <th className="p-3">Cliente</th>
                    <th className="p-3">Teléfono</th>
                    <th className="p-3">Correo</th>
                    <th className="p-3 text-center">Assets Activos</th>
                    <th className="p-3 text-center">Tickets Totales</th>
                    <th className="p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedClientes.map((Cliente) => (
                    <tr key={Cliente.idCliente} className="border-b border-gray-200 hover:bg-blue-50">
                      <td className="p-3 text-blue-500">{Cliente.idCliente}</td>
                      <td className="p-3 text-black">{Cliente.nombreCliente}</td>
                      <td className="p-3 text-black">{Cliente.telefono}</td>
                      <td className="p-3 text-black">
                        <div className="flex items-center space-x-2">
                          <div className="flex-grow truncate max-w-[8rem] text-black">{Cliente.correo}</div>
                          <button
                            className="text-gray-500 hover:text-gray-800"
                            onClick={() => copyToClipboard(Cliente.correo)}
                          >
                            <Files className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-center text-black">{Cliente.totalActivos}</td>
                      <td className="p-3 text-center text-black">
                        {Cliente.totalTickets}
                      </td>
                      <td className="p-3 text-center">
                        {/* Botón para editar técnico */}
                        <button
                          onClick={() => setSelectedCliente(Cliente)}
                          className="text-blue-500 hover:text-blue-700 mr-3"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        {/* Botón para eliminar técnico */}
                        <button
                          onClick={() => handleDeleteCliente(Cliente.idCliente, Cliente.nombreCliente, Cliente.totalActivos)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Controles de paginación */}
            <div className="flex justify-center md:justify-end mt-4 space-x-2">
              <button
                onClick={previousPage}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 text-black rounded disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {renderPaginationButtons()}
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 text-black rounded disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal para editar técnico */}
        {selectedCliente && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full">
              <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h3 className="text-lg font-semibold text-black">Editar Cliente</h3>
                <button
                  onClick={() => setSelectedCliente(null)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log("Formulario enviado");

                  const formData = new FormData(e.target as HTMLFormElement);
                  const rawFormData = Object.fromEntries(formData.entries());
                  console.log("Datos del formulario:", rawFormData);

                  const newTecnicoData = {
                    nombreCliente: String(rawFormData.nombreCliente),
                    correo: String(rawFormData.correo),
                    telefono: String(rawFormData.telefono),
                  };
                  console.log("Datos procesados:", newTecnicoData);

                  if (selectedCliente && selectedCliente.idCliente) {
                    handleAddOrEditCliente(selectedCliente.idCliente, newTecnicoData);
                  } else {
                    console.error("ID del técnico no definido");
                  }
                }}
              >
                {[
                  { label: "Nombre del Cliente", name: "nombreCliente" as ClienteKeys },
                  { label: "Correo", name: "correo" as ClienteKeys },
                  { label: "Teléfono", name: "telefono" as ClienteKeys },
                ].map(({ label, name }) => (
                  <div key={name} className="mb-3">
                    <label className="block text-sm text-black capitalize">{label}</label>
                    <input
                      type="text"
                      name={name}
                      defaultValue={selectedCliente[name] || ""}
                      className="w-full bg-slate-50 text-black p-2 border rounded-md"
                    />
                  </div>
                ))}
                <button type="submit" className="w-full bg-primary text-white p-2 rounded-lg mt-3">
                  Guardar
                </button>
              </form>
            </div>
          </div>
        )}


        {/* Modal para confirmar eliminación */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModal}
          message={modalMessage}
          onConfirm={modalType === "confirm" ? handleConfirmDelete : () => { }}
          onCancel={handleCloseModal}
          type={modalType}
        />
      </main>
    </div>
  );
}

export default withAuth(ClientesLayout);
