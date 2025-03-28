import { useEffect, useState } from "react";
import withAuth from "~/utils/apiLogin/auth";
import { DynamicIcon } from "~/components/dynamicIcons";
import { Sidebar } from "~/components/sidebar";
import { Navbar } from "~/components/navbar";
import { Tecnico } from "~/utils/apiTecnicos/tecnico";
import { getTecnicos } from "~/utils/apiTecnicos/tecnicosGet";
import { editTecnico } from "~/utils/apiTecnicos/tecnicosEdit";
import { deleteTecnico } from "~/utils/apiTecnicos/tecnicosDelete";
import DisponibilidadDropdown from "~/utils/apiTecnicos/statusChangeTecnico";
import { Modal } from "~/components/Modal";

type TecnicoKeys = keyof Tecnico;

function TecnicosLayout() {
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [estado, setEstado] = useState<string | null>(null);
  const pageSize = 5; // Define el tamaño de la página

  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [selectedTecnico, setSelectedTecnico] = useState<Tecnico | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTecnicoId, setDeleteTecnicoId] = useState<number | null>(null);
  const [deleteTecnicoName, setDeleteTecnicoName] = useState<string>("");
  const [sortedTecnicos, setSortedTecnicos] = useState<Tecnico[]>([]);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"confirm" | "alert">("confirm");
  const pageTitle = "Técnicos";

  // Función para obtener los técnicos
  const fetchTecnicos = async () => {
    try {
      const response = await getTecnicos(estado, currentPage, pageSize);
      console.log("Respuesta de la API:", response);

      const { tecnicos, totalRegistros } = response;
      console.log("Total de registros:", totalRegistros);
      console.log("Tamaño de página (pageSize):", pageSize);

      if (typeof totalRegistros !== "number" || totalRegistros <= 0) {
        throw new Error("El total de registros no es un número válido.");
      }
      if (typeof pageSize !== "number" || pageSize <= 0) {
        throw new Error("El tamaño de página no es un número válido.");
      }

      setTecnicos(tecnicos);
      setTotalPages(Math.ceil(totalRegistros / pageSize));
    } catch (error) {
      console.error("Error al obtener técnicos:", error);
      setTotalPages(1);
    }
  };

  // Llama a la API cuando cambia currentPage o estado
  useEffect(() => {
    fetchTecnicos();
  }, [currentPage, estado]);

  // Funciones para cambiar de página
  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Renderizado de los botones de paginación
  const renderPaginationButtons = () => {
    const buttons = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(startPage + 4, totalPages);

    for (let page = startPage; page <= endPage; page++) {
      buttons.push(
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`w-[2rem] py-1 rounded ${currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
            }`}
        >
          {page}
        </button>
      );
    }

    return buttons;
  };

  const handleAddOrEditTecnico = async (id: number, tecnicoData: any) => {
    console.log("ID del técnico:", id);
    console.log("Datos a enviar:", tecnicoData);

    try {
      const result = await editTecnico(id, tecnicoData);
      console.log("Respuesta de la API:", result);

      alert(result.message);
      setSelectedTecnico(null);
    } catch (error) {
      console.error('Error en handleAddOrEditTecnico:', error);
      alert('Hubo un error al actualizar el técnico');
    }
  };

  // Función para manejar la eliminación de un técnico 
  const handleDelete = (idTecnico: number, nombreTecnico: string, ticketsAsignados: string | number) => {
    setDeleteTecnicoId(idTecnico);
    setDeleteTecnicoName(nombreTecnico);
    setModalType("confirm"); // Inicia como modal de confirmación

    // Convertimos ticketsAsignados a número y validamos
    const tickets = Number(ticketsAsignados);

    if (isNaN(tickets) || tickets <= 0) {
      // Si no tiene tickets asignados
      setModalMessage(`¿Seguro que quieres eliminar al técnico "${nombreTecnico}"?`);
    } else {
      // Si tiene tickets asignados
      setModalMessage(`El técnico "${nombreTecnico}" tiene tickets asignados y no puede ser eliminado.`);
      setModalType("alert"); // Modo alerta si no se puede eliminar
    }

    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTecnicoId) {
      const success = await deleteTecnico(deleteTecnicoId);
      if (success) {
        setTecnicos((prevTecnicos) => prevTecnicos.filter((t) => t.idTecnico !== deleteTecnicoId));
        setModalMessage(`El técnico "${deleteTecnicoName}" fue eliminado exitosamente.`);
      } else {
        setModalMessage(`Hubo un error al eliminar al técnico "${deleteTecnicoName}".`);
      }
      setModalType("alert"); // Cambia el modal a modo alerta
      setIsDeleteModalOpen(true); // Reabre el modal con el nuevo mensaje
    }
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  // Filtrar técnicos según la búsqueda
  useEffect(() => {
    const filtered = tecnicos.filter((tecnico) =>
      tecnico.idTecnico?.toString().includes(search) ||
      tecnico.nombreTecnico.toLowerCase().includes(search.toLowerCase()) ||
      tecnico.ticketsAsignados.toLowerCase().includes(search.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) =>
      sortAsc ? a.idTecnico - b.idTecnico : b.idTecnico - a.idTecnico
    );

    setSortedTecnicos(sorted);  // Se actualiza una sola vez por cambio en dependencias
  }, [tecnicos, search, sortAsc]);


  // Alternar orden ascendente/descendente
  const toggleSortOrder = () => {
    setSortAsc(!sortAsc);
  };

  // Alterna la visibilidad de la barra lateral
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const copyToClipboard = (correo: string) => {
    navigator.clipboard.writeText(correo);
  };

  return (
    <div className="w-screen h-screen flex bg-sky-50">
      {/* Sidebar */}
      <Sidebar sidebarVisible={sidebarVisible} toggleSidebar={toggleSidebar} />

      {/* Contenido principal */}
      <main className="flex flex-col h-full w-full">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} title={pageTitle} />

        {/* Contenido principal */}
        <div className="flex h-full p-4 md:p-6 overflow-auto">
          {/* Tabla */}
          <div className="flex flex-col justify-between bg-white h-full w-full shadow-md rounded-3xl p-6 overflow-x-auto">
            <div className="flex flex-col">
              {/* Encabezado de la tabla */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-black">Técnicos</h1>
                  <p className="text-sm text-blue-500">Gestion de técnicos</p>
                </div>
              </div>

              {/* Tabla de técnicos */}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-black uppercase text-sm leading-normal">
                    <th className="p-3">ID</th>
                    <th className="p-3">Nombre Cuadrilla</th>
                    <th className="p-3">Teléfono</th>
                    <th className="p-3">Correo</th>
                    <th className="p-3 text-center">Tickets Asignados</th>
                    <th className="p-3">Disponibilidad</th>
                    <th className="p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTecnicos.map((tecnico) => (
                    <tr key={tecnico.idTecnico} className="border-b border-gray-200 hover:bg-blue-50">
                      <td className="p-3 text-blue-500">{tecnico.idTecnico}</td>
                      <td className="p-3 text-black">{tecnico.nombreTecnico}</td>
                      <td className="p-3 text-black">{tecnico.telefono}</td>
                      <td className="p-3 text-black">
                        <div className="flex items-center space-x-2">
                          <div className="flex-grow truncate max-w-[8rem] text-black">{tecnico.correo}</div>
                          <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => copyToClipboard(tecnico.correo)}
                          >
                            <DynamicIcon iconName="Files" className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-center text-black">{tecnico.ticketsAsignados}</td>
                      <td className="py-3 px-6">
                        <div className={`w-full h-full px-2 py-1 rounded-lg ${tecnico.estado === "Disponible" ? "bg-cyan-600 text-white" :
                          tecnico.estado === "Ocupado" ? "bg-blue-700 text-white" :
                            tecnico.estado === "De baja" ? "bg-slate-700 text-white" :
                              tecnico.estado === "En descanso" ? "bg-blue-400 text-white" :
                                "bg-gray-300 text-gray-800"
                          }`}>
                          <DisponibilidadDropdown
                            tecnico={tecnico}
                            onEstadoActualizado={(id, nuevoEstado) => {
                              const nuevosTecnicos = sortedTecnicos.map(t =>
                                t.idTecnico === id ? { ...t, estado: nuevoEstado } : t
                              );
                              setSortedTecnicos(nuevosTecnicos);
                            }}
                          />
                        </div>

                      </td>
                      <td className="py-3 px-6 text-center">
                        {/* Botón para editar técnico */}
                        <button
                          onClick={() => setSelectedTecnico(tecnico)}
                          className="text-blue-500 hover:text-blue-700 mr-3"
                        >
                          <DynamicIcon iconName="Pencil" className="w-5 h-5" />
                        </button>
                        {/* Botón para eliminar técnico */}
                        <button
                          onClick={() => handleDelete(tecnico.idTecnico, tecnico.nombreTecnico, tecnico.ticketsAsignados)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <DynamicIcon iconName="Trash2" className="w-5 h-5" />
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
                <DynamicIcon iconName="ChevronLeft" className="w-5 h-5" />
              </button>
              {renderPaginationButtons()}
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 text-black rounded disabled:opacity-50"
              >
                <DynamicIcon iconName="ChevronRight" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal para editar técnico */}
        {selectedTecnico && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full">
              <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h3 className="text-lg font-semibold text-black">Editar Técnico</h3>
                <button
                  onClick={() => setSelectedTecnico(null)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <DynamicIcon iconName="X" className="w-5 h-5" />
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
                    nombreTecnico: String(rawFormData.nombreTecnico),
                    correo: String(rawFormData.correo),
                    telefono: String(rawFormData.telefono),
                  };
                  console.log("Datos procesados:", newTecnicoData);

                  if (selectedTecnico && selectedTecnico.idTecnico) {
                    handleAddOrEditTecnico(selectedTecnico.idTecnico, newTecnicoData);
                  } else {
                    console.error("ID del técnico no definido");
                  }
                }}
              >
                {[
                  { label: "Nombre Cuadrilla", name: "nombreTecnico" as TecnicoKeys },
                  { label: "Correo", name: "correo" as TecnicoKeys },
                  { label: "Teléfono", name: "telefono" as TecnicoKeys },
                ].map(({ label, name }) => (
                  <div key={name} className="mb-3">
                    <label className="block text-sm text-black capitalize">{label}</label>
                    <input
                      type="text"
                      name={name}
                      defaultValue={selectedTecnico[name] || ""}
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

export default withAuth(TecnicosLayout);