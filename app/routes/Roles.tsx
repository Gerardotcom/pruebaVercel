import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Search, ChevronDown, ChevronUp, Files, Plus, X, Pencil, Trash2 } from "lucide-react";
import { Sidebar } from "~/components/sidebar";
import { Navbar } from "~/components/navbar";
import { useCrearUsuario } from "~/utils/apiRoles/crearUsuario";

export default function UserCreationForm() {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        role: ""
    });

    // Alternar la visibilidad de la barra lateral
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        alert("Formulario enviado");

        const usuario = {
            Nombre: formData.fullName,
            Correo: formData.email,
            Contrasena: formData.password,
            Telefono: formData.phone,
            IdRol: roles.find(role => role.nombre === formData.role)?.id || 0,
            Salt: "",
            FechaRegistro: new Date()
        };

        alert("Datos a enviar: " + JSON.stringify(usuario));

        const success = await registrarUsuario(usuario);
        if (success) {
            alert("Usuario registrado correctamente");
            setFormData({
                fullName: "",
                email: "",
                password: "",
                phone: "",
                role: ""
            });
        }

    };


    const validateForm = () => {
        const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10,15}$/;

        if (!formData?.fullName || !nameRegex.test(formData.fullName)) {
            alert("El nombre solo puede contener letras y espacios.");
            return false;
        }
        if (!formData?.email || !emailRegex.test(formData.email)) {
            alert("Ingrese un correo electrónico válido.");
            return false;
        }
        if (!formData?.phone || !phoneRegex.test(formData.phone)) {
            alert("El teléfono debe contener entre 10 y 15 dígitos.");
            return false;
        }

    };

    const { roles, registrarUsuario, loading, error } = useCrearUsuario();

    return (
        <div className="flex justify-center items-center h-screen w-screen bg-sky-50">
            {/* Sidebar */}
            <Sidebar sidebarVisible={sidebarVisible} toggleSidebar={toggleSidebar} />
            <div className="flex flex-col h-full w-full">
                {/* Navbar */}
                <Navbar toggleSidebar={toggleSidebar} title="Tickets" />
                <div className="flex justify-center items-center h-full w-full">
                    <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded-3xl w-[500px]">
                        <h2 className="text-xl text-black font-bold mb-4">Creación de usuarios</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" name="fullName" placeholder="Nombre completo" value={formData.fullName} onChange={handleChange} className="bg-slate-50 text-black border p-2 rounded-md" required />
                            <input type="email" name="email" placeholder="Correo Electrónico" value={formData.email} onChange={handleChange} className="bg-slate-50 text-black border p-2 rounded-md" required />
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} className="bg-slate-50 text-black border p-2 rounded-md w-full" required />
                                <button type="button" className="absolute right-2 top-3 text-gray-600" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <input type="tel" name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} className="bg-slate-50 text-black border p-2 rounded-md" required />
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="bg-slate-50 text-black border p-2 rounded-md col-span-2"
                                required
                            >
                                <option value="">Elegir rol</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.nombre}>
                                        {role.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-primary text-white py-2 mt-4 rounded-md hover:bg-blue-900">Guardar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}