import { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Plus, X, Pencil, Trash2 } from "lucide-react";
import { Sidebar } from "~/components/sidebar";
import { Navbar } from "~/components/navbar";
import CrearAssetModal from "~/components/assets/crearAssetModal";
import EditarAssetModal from "~/components/assets/editarAsset";
import { Asset } from "~/utils/apiAssets/asset";
import { Cliente } from "~/utils/apiAssets/Cliente";
import { getAssets } from "~/utils/apiAssets/getAssets";
import { getClientes } from "~/utils/apiAssets/getClientes";
import { actualizarEstado } from "~/utils/apiAssets/cambiarEstados";
import { agregarAsset } from "~/utils/apiAssets/crearAsset";
import { editarAsset } from "~/utils/apiAssets/editAsset";
import { eliminarAsset } from "~/utils/apiAssets/deleteAsset";
import { Modal } from "~/components/Modal";
import withAuth from "~/utils/apiLogin/auth";


function AssetsLayout() {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [search, setSearch] = useState("");
    const [sortAsc, setSortAsc] = useState(true);
    const [isAddingAsset, setIsAddingAsset] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<any>(null);
    const [assets, setAssets] = useState<any[]>([]);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState<"confirm" | "alert">("confirm");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteAssetId, setDeleteAssetId] = useState<number | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [estado, setEstado] = useState<string | null>(null);
    const pageSize = 5; // Define el tamaño de la página

    const fetchAssets = async () => {
        try {
            const assetsData = await getAssets(currentPage, pageSize);
            const clientesData: Cliente[] = await getClientes(); // Definir como array de Cliente

            // Verifica que los datos de assets sean correctos
            if (!assetsData || !assetsData.assets || assetsData.assets.length === 0) {
                console.error("No se encontraron assets en la API o la estructura es incorrecta");
                setAssets([]);
                setTotalPages(1);
                return;
            }

            // Verifica que los datos de clientes sean correctos
            if (!clientesData || !Array.isArray(clientesData)) {
                console.error("No se encontraron clientes o la estructura es incorrecta");
                setAssets([]);
                setTotalPages(1);
                return;
            }

            console.log("Clientes obtenidos:", clientesData); // Para verificar que los clientes están siendo obtenidos correctamente

            // No es necesario usar flat() si clientesData ya es un arreglo plano
            const clientes = Array.isArray(clientesData) ? clientesData : []; // Si por alguna razón no es un array, asignar un array vacío

            // Asociar los clientes con los assets usando el idCliente
            const assetsConClientes = assetsData.assets.map((asset: Asset) => {
                const cliente = clientes.find(
                    (cliente: Cliente) => cliente.idCliente === asset.idCliente
                );
                return {
                    ...asset,
                    nombreCliente: cliente ? cliente.nombreCliente : "Desconocido", // Asocia el nombre del cliente
                };
            });

            setAssets(assetsConClientes); // Establece los assets con los nombres de los clientes
            setTotalPages(Math.max(Math.ceil(assetsData.totalRecords / pageSize), 1));
        } catch (error) {
            console.error("Error al obtener los datos:", error);
        }
    };

    // Llama a la API cuando cambia currentPage o estado
    useEffect(() => {
        fetchAssets();
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

    const handleDeleteAssetClick = (asset: any) => {
        if (asset.ticketsRelacionados > 0) {
            setModalMessage(`No se puede eliminar "${asset.nombreAsset}"`);
            setModalType("alert");
            setIsDeleteModalOpen(true);
        } else {
            setModalMessage(`¿Seguro que quieres eliminar el asset: "${asset.nombreAsset}"?`);
            setModalType("confirm");
            setDeleteAssetId(asset.idAsset);
            setIsDeleteModalOpen(true);
        }
    };

    const handleConfirmDelete = async () => {
        if (deleteAssetId) {
            try {
                await eliminarAsset(deleteAssetId);
                setAssets(prevAssets => prevAssets.filter(asset => asset.idAsset !== deleteAssetId));
                setModalMessage("El asset fue eliminado exitosamente.");
                setModalType("alert");
            } catch (error) {
                setModalMessage("Hubo un error al eliminar el asset.");
                setModalType("alert");
            }
            setIsDeleteModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleEstadoChange = async (id: number, nuevoEstado: string) => {
        try {
            // Actualizar el estado localmente primero para que el UI sea más rápido
            setAssets((prevAssets) =>
                prevAssets.map((asset) =>
                    asset.idAsset === id ? { ...asset, estado: nuevoEstado } : asset
                )
            );

            // Luego, realiza la llamada al API
            await actualizarEstado(id, nuevoEstado);
            console.log(`Estado del asset ${id} actualizado a: ${nuevoEstado}`);
        } catch (error) {
            console.error('Error al actualizar el estado:', error);
        }
    };

    // Filtrar assets según la búsqueda
    const filteredAssets = assets.filter((asset) =>
        asset.idAsset.toString().includes(search) ||
        asset.nombreAsset.toLowerCase().includes(search.toLowerCase())
    );

    // Ordenar assets por ID
    const sortedAssets = [...filteredAssets].sort((a, b) =>
        sortAsc ? a.idAsset - b.idAsset : b.idAsset - a.idAsset
    );

    // Alternar orden ascendente/descendente
    const toggleSortOrder = () => {
        setSortAsc(!sortAsc);
    };

    // Alterna la visibilidad de la barra lateral
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    // Función para agregar o editar un asset
    const handleAddOrEditAsset = async (newAssetData: any) => {
        if (isAddingAsset) {
            try {
                // Suponiendo que tienes una función para agregar un asset en la API
                await agregarAsset(newAssetData);
                fetchAssets(); // Refrescar la lista después de agregar
            } catch (error) {
                console.error("Error al agregar el asset:", error);
            }
        } else {
            setAssets((prevAssets) =>
                prevAssets.map((asset) =>
                    asset.idAsset === selectedAsset.idAsset ? { ...asset, ...newAssetData } : asset
                )
            );
        }
        setIsAddingAsset(false);
        setSelectedAsset(null);
    };

    const handleEditAsset = async (updatedAssetData: any) => {
        try {
            if (selectedAsset) {
                await editarAsset(selectedAsset.idAsset, updatedAssetData); // Usar la API para editar el asset
                fetchAssets(); // Refrescar la lista de assets después de editar
                setSelectedAsset(null); // Resetear el asset seleccionado
            }
        } catch (error) {
            console.error("Error al editar el asset:", error);
        }
    };

    // Mostrar el modal solo si hay un asset seleccionado para editar
    const showEditModal = selectedAsset !== null;

    const handleDeleteAsset = async (idAsset: string | number) => {
        try {
            const resultMessage = await eliminarAsset(idAsset); // Llamada a la función de eliminación
            setMessage(resultMessage);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error desconocido');
        }
    };



    return (
        <div className="w-screen h-screen flex bg-sky-50">
            {/* Sidebar */}
            <Sidebar sidebarVisible={sidebarVisible} toggleSidebar={toggleSidebar} />

            {/* Contenido principal */}
            <main className="flex flex-col h-full w-full overflow-hidden">
                {/* Navbar */}
                <Navbar toggleSidebar={toggleSidebar} title={'Assets'} />

                {/* Contenido principal */}
                <div className="flex w-full h-full p-4 md:p-6">
                    {/* Tabla */}
                    <div className="flex flex-col h-full w-full justify-between bg-white shadow-md rounded-3xl p-6">
                        <div className="flex flex-col w-full h-full">
                            {/* Encabezado de la tabla */}
                            <div className="flex justify-between w-full items-center mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-black">Assets</h1>
                                    <p className="text-sm text-blue-500">Gestión de assets</p>
                                </div>

                                {/* Barra de búsqueda y botón de ordenar */}
                                <div className="flex space-x-4">
                                    {/* Botón para agregar un nuevo Asset */}
                                    <button
                                        className="h-10 w-10 flex items-center bg-[#0047BA] text-black p-2 rounded-full space-x-2"
                                        onClick={() => setIsAddingAsset(true)}
                                    >
                                        <Plus className="w-6 h-5 text-white" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex w-full h-full overflow-auto">
                                {/* Tabla de Asset */}
                                <table className="w-full h-fit text-left border-collapse">
                                    <thead>
                                        <tr className="border-b bg-gray-100">
                                            <th className="py-1 px-6 bg-gray-100 sticky left-0 text-left text-black text-xs whitespace-nowrap">ID</th>
                                            <th className="py-1 px-2 text-left text-black text-xs whitespace-nowrap">Nombre</th>
                                            <th className="py-1 px-2 text-left text-black text-xs whitespace-nowrap">Número de <br /> Modelo </th>
                                            <th className="py-1 px-2 text-left text-black text-xs whitespace-nowrap"> Número de <br /> Serie </th>
                                            <th className="py-1 px-2 text-left text-black text-xs whitespace-nowrap md:table-cell hidden lg:table-cell">Marca</th>
                                            <th className="py-1 px-2 text-left text-black text-xs whitespace-nowrap md:table-cell hidden lg:table-cell">Descripción</th>
                                            <th className="py-1 px-2 text-left text-black text-xs whitespace-nowrap md:table-cell hidden lg:table-cell">Capacidad</th>
                                            <th className="py-1 px-2 text-left text-black text-xs whitespace-nowrap"> Fecha de <br /> Adquisición </th>
                                            <th className="py-1 px-2 text-left text-black text-xs whitespace-nowrap">Ubicación</th>
                                            <th className="py-1 px-2 text-left text-black text-xs w-[8rem] whitespace-nowrap">Estado</th>
                                            <th className="py-1 px-2 text-center text-black text-xs whitespace-nowrap"> Tickets </th>
                                            <th className="py-1 px-2 text-center text-black text-xs whitespace-nowrap">Cliente <br /> (Nombre) </th>
                                            <th className="py-1 px-2 text-center text-black text-xs min-w-[6rem] whitespace-nowrap">Acciones</th>
                                        </tr>

                                    </thead>
                                    <tbody className="text-xs"> {/* Esto hace que el texto de la tabla sea más pequeño */}
                                        {assets.map((asset) => (
                                            <tr key={asset.idAsset} className="border-b border-gray-200 hover:bg-blue-50">
                                                <td className="py-1 px-6 text-blue-500 bg-white sticky left-0">{asset.idAsset}</td>
                                                <td className="py-1 px-2 text-black truncate max-w-[8rem]">{asset.nombreAsset}</td>
                                                <td className="py-1 px-2 text-black truncate max-w-[8rem]">{asset.numModelo}</td>
                                                <td className="py-1 px-2 text-black truncate max-w-[8rem]">{asset.numSerie}</td>
                                                <td className="py-1 px-2 text-black truncate max-w-[8rem]">{asset.marca}</td>
                                                <td className="py-1 px-2 text-black truncate max-w-[12rem]">{asset.descripcion}</td>
                                                <td className="py-1 px-2 text-black truncate max-w-[8rem]">{asset.capacidad}</td>
                                                <td className="py-1 px-2 text-black truncate max-w-[8rem]">{asset.fechaAdquisicion}</td>
                                                <td className="py-1 px-2 text-black truncate max-w-[8rem]">{asset.ubicacion}</td>
                                                <td className="py-3 px-2 text-center">
                                                    <div
                                                        className={`w-[8rem] px-2 py-1 mr-2 rounded-md ${asset.estado === "En Uso" ? "bg-green-500 text-white" :
                                                            asset.estado === "Dañado" ? "bg-red-600 text-white" :
                                                                asset.estado === "En reparacion" ? "bg-yellow-500 text-white" :
                                                                    asset.estado === "En uso" ? "bg-green-500 text-white" :
                                                                        "bg-gray-300 text-gray-800"
                                                            }`}
                                                    >
                                                        <select
                                                            value={asset.estado}
                                                            onChange={async (e) => {
                                                                const nuevoEstado = e.target.value;
                                                                try {
                                                                    await handleEstadoChange(asset.idAsset, nuevoEstado);
                                                                    alert(`Estado del asset actualizado a "${nuevoEstado}"`);
                                                                } catch (error) {
                                                                    console.error("Error al cambiar estado del asset:", error);
                                                                    alert("Hubo un error al cambiar el estado del asset.");
                                                                }
                                                            }}
                                                            className="bg-transparent w-full focus:outline-none cursor-pointer"
                                                        >
                                                            {["En uso", "Dañado", "En reparacion"].map((estado) => (
                                                                <option
                                                                    key={estado}
                                                                    value={estado}
                                                                    className="text-black" // Asegura que el texto se vea bien
                                                                >
                                                                    {estado}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </td>

                                                <td className="py-3 px-6 text-center text-black truncate max-w-[8rem]">{asset.ticketsRelacionados}</td>
                                                <td className="py-3 px-6 text-black text-center truncate max-w-[8rem]">
                                                    <div className="whitespace-nowrap font-semibold">{asset.nombreCliente}</div>
                                                    <div className="whitespace-nowrap text-gray-600">{asset.idCliente}</div>
                                                </td>
                                                <td className="py-3 px-2 text-center">
                                                    <button
                                                        onClick={() => setSelectedAsset(asset)}
                                                        className="text-blue-500 hover:text-blue-700 mr-3"
                                                    >
                                                        <Pencil className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => handleDeleteAssetClick(asset)} className="text-red-500 hover:text-red-700">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
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

                {/* Modal para agregar/editar asset */}
                {isAddingAsset && (
                    <CrearAssetModal
                        isVisible={isAddingAsset}
                        onClose={() => setIsAddingAsset(false)}
                        onSubmit={handleAddOrEditAsset}
                    />
                )}

                {/* Modal de edición de asset */}
                {showEditModal && (
                    <EditarAssetModal
                        asset={selectedAsset}
                        isVisible={showEditModal}
                        onClose={() => setSelectedAsset(null)} // Cerrar el modal cuando se cancela
                        onSubmit={handleEditAsset} // Llamar a la función para editar el asset
                    />
                )}
            </main>
            {/* Modal para confirmar eliminación */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseModal}
                message={modalMessage}
                onConfirm={modalType === "confirm" ? handleConfirmDelete : () => { }}
                onCancel={handleCloseModal}
                type={modalType}
            />
        </div>
    );
}

export default withAuth(AssetsLayout);