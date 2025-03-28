import { useState, useEffect } from "react";
import withAuth from "~/utils/apiLogin/auth";
import { DynamicIcon } from "~/components/dynamicIcons";
import { Sidebar } from "~/components/sidebar";
import { Navbar } from "~/components/navbar";
import { obtenerPerfil, actualizarPerfil, PerfilDatos } from "~/utils/apiPerfil/profileApi";

function EditProfile() {
  const [isEditing, setIsEditing] = useState({ nombre: false, correo: false, telefono: false });
  const [formData, setFormData] = useState<PerfilDatos>({ nombre: "", correo: "", telefono: "" });
  const [fechaRegistro, setFechaRegistro] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Mensaje de éxito
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    fetchPerfil();
  }, []);

  const fetchPerfil = async () => {
    try {
      const data = await obtenerPerfil();
      setFormData({ nombre: data.nombre, correo: data.correo, telefono: data.telefono });

      // Convertir fecha al formato dd/MM/yy
      const fecha = new Date(data.fechaRegistro);
      const formattedDate = fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
      setFechaRegistro(formattedDate);
    } catch (err) {
      setError("No tienes permiso para editar este perfil");
    }
  };

  const handleEdit = (field: keyof PerfilDatos) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError("");
    setSuccess(""); // Limpiar mensajes previos
    try {
      await actualizarPerfil(formData);
      setSuccess("Perfil actualizado correctamente");
      fetchPerfil();
    } catch (err) {
      setError("Error al actualizar el perfil. Verifica tu sesión o permisos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 text-black">
      <Sidebar sidebarVisible={sidebarVisible} toggleSidebar={() => setSidebarVisible(!sidebarVisible)} />
      <div className="flex flex-col flex-1">
        <Navbar title="Editar Perfil" toggleSidebar={() => setSidebarVisible(!sidebarVisible)} />
        <main className="flex justify-center items-center flex-1 p-6">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            {/* Título centrado */}
            <h2 className="text-xl font-semibold text-black mb-4 text-center">Editar tu perfil</h2>
            
            {/* Mensajes de error o éxito centrados */}
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {success && <p className="text-green-500 text-center mb-4">{success}</p>}

            <div className="space-y-4">
              {Object.keys(formData).map((field) => (
                <div key={field} className="relative">
                  <label className="block text-gray-700 capitalize text-left">{field}</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      name={field}
                      value={formData[field as keyof PerfilDatos]}
                      onChange={handleChange}
                      className="w-full p-2 rounded-md border bg-white text-black border-gray-300 focus:outline-none"
                      readOnly={!isEditing[field as keyof PerfilDatos]}
                    />
                    <button type="button" onClick={() => handleEdit(field as keyof PerfilDatos)} className="ml-2 p-2 text-gray-600 hover:text-blue-500">
                      {isEditing[field as keyof PerfilDatos] ? <DynamicIcon iconName="Save" className="w-6 h-6" /> : <DynamicIcon iconName="Edit" className="w-6 h-6" /> }
                    </button>
                  </div>
                </div>
              ))}

              <div className="relative">
                <label className="block text-gray-700 text-left">Fecha de Registro</label>
                <input type="text" value={fechaRegistro} readOnly className="w-full p-2 rounded-md border bg-gray-200 text-black border-gray-300 text-left" />
              </div>
            </div>

            <button onClick={handleUpdate} className="w-full mt-6 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default withAuth(EditProfile);
