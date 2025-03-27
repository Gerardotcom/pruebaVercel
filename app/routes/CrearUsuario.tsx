import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Sidebar } from "~/components/sidebar";
import { Navbar } from "~/components/navbar";
import { Form, useActionData } from "@remix-run/react";
import { ActionFunction, json } from "@remix-run/node";
import { createUser, getRoles } from "~/utils/apiAssets/gestionRoles";
import { userValidations } from "~/utils/apiRoles/validaciones";

export let action: ActionFunction = async ({ request }) => {
    let formData = await request.formData();
    let data = {
        nombre: String(formData.get("nombre") || ""),
        correo: String(formData.get("correo") || ""),
        contrasena: String(formData.get("contrasena") || ""),
        telefono: String(formData.get("telefono") || ""),
        idRol: Number(formData.get("idRol")),
    };

    console.log("Datos recibidos en action:", data);

    if (!data.nombre || !data.correo || !data.contrasena || !data.telefono || !data.idRol) {
        console.error("Error: Todos los campos son obligatorios.");
        return json({ error: "Todos los campos son obligatorios." }, { status: 400 });
    }

    try {
        console.log("Enviando datos al backend:", data);
        const response = await createUser(data);
        console.log("Respuesta de la API:", response);
        return json({ success: "Usuario registrado correctamente", data: response });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        return json({ error: "Error al registrar el usuario." }, { status: 500 });
    }
};
export default function UsuariosAdmin() {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [roles, setRoles] = useState<{ id: number; nombre: string }[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [globalError, setGlobalError] = useState<string | null>(null);  // Estado para el error global



    useEffect(() => {
        getRoles()
            .then(setRoles)
            .catch((error) => console.error("Error al cargar los roles:", error));
    }, []);

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    let actionData = useActionData<typeof action>();

    const [errors, setErrors] = useState({
        nombre: "",
        correo: "",
        contrasena: "",
        telefono: "",
        idRol: "",
    });

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let errorMessage = "";

        switch (name) {
            case "nombre":
                if (value.length < userValidations.nombre.minLength) {
                    errorMessage = `Debe tener al menos ${userValidations.nombre.minLength} caracteres.`;
                }
                break;

            case "correo":
                if (!userValidations.correo.pattern.test(value)) {
                    errorMessage = "Correo inválido.";
                }
                break;

            case "contrasena":
                if (value.length < userValidations.contrasena.minLength) {
                    errorMessage = `La contraseña debe tener al menos ${userValidations.contrasena.minLength} caracteres.`;
                } else if (value.length > userValidations.contrasena.maxLength) {
                    errorMessage = `La contraseña debe tener como máximo ${userValidations.contrasena.maxLength} caracteres.`;
                } else if (!userValidations.contrasena.pattern.test(value)) {
                    errorMessage = "Debe incluir mayúscula, minúscula, número y carácter especial.";
                }
                break;

            case "telefono":
                if (!userValidations.telefono.pattern.test(value)) {
                    errorMessage = "Solo se permiten números.";
                } else if (value.length !== userValidations.telefono.maxLength) {
                    errorMessage = `Debe tener ${userValidations.telefono.maxLength} dígitos.`;
                }
                break;

            case "idRol":
                if (!value) {
                    errorMessage = "Seleccione un rol.";
                }
                break;

            default:
                break;
        }

        setErrors((prev) => ({ ...prev, [name]: errorMessage }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();  // Evita el envío del formulario antes de validar

        // Verificar si hay errores
        const hasErrors = Object.values(errors).some((error) => error !== "");

        if (hasErrors) {
            setGlobalError("Por favor, corrija los errores antes de enviar el formulario.");
            return;
        }

        // Si no hay errores, proceder con el envío
        e.currentTarget.submit();
    };


    return (
        <div className="w-screen h-screen flex bg-sky-50 relative">
            <Sidebar sidebarVisible={sidebarVisible} toggleSidebar={toggleSidebar} />
            <div className="flex-1 flex flex-col">
                <Navbar toggleSidebar={toggleSidebar} title="Crear usuario" />
                <main className="flex-1 p-2 md:p-10 flex flex-col md:flex-row overflow-y-auto">
                    <section className="w-full">
                        <div className="max-w-xl p-8 mx-auto mt-8 bg-white rounded-t-3xl shadow-xl sm:p-10">
                            <h2 className="text-2xl font-semibold text-center text-primary sm:text-3xl mb-4">
                                Nuevo Usuario
                            </h2>

                            {globalError && (
                                <p className="mb-4 rounded bg-red-100 p-2 text-red-600">{globalError}</p>
                            )}

                            {actionData?.error && (
                                <p className="mb-4 rounded bg-red-100 p-2 text-red-600">{actionData.error}</p>
                            )}
                            {actionData?.success && (
                                <p className="mb-4 rounded bg-green-100 p-2 text-green-600">{actionData.success}</p>
                            )}

                            <Form method="post" className="space-y-4" onSubmit={handleSubmit}>
                                {/* Nombre */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        className={`bg-transparent text-black mt-1 w-full rounded-md border p-3 shadow-sm focus:ring-gray-500
      ${errors.nombre ? "border-red-500" : "border-gray-200"}
    `}
                                        required
                                        onBlur={handleBlur}
                                        maxLength={userValidations.nombre.maxLength}
                                    />
                                    {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                                </div>

                                {/* Correo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Correo</label>
                                    <input
                                        type="email"
                                        name="correo"
                                        className={`bg-transparent text-black mt-1 w-full rounded-md border p-3 shadow-sm focus:ring-gray-500
      ${errors.correo ? "border-red-500" : "border-gray-200"}
    `}
                                        required
                                        onBlur={handleBlur}
                                        maxLength={userValidations.correo.maxLength}
                                    />
                                    {errors.correo && <p className="text-red-500 text-sm mt-1">{errors.correo}</p>}
                                </div>

                                {/* Contraseña */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="contrasena"
                                            className={`bg-transparent text-black mt-1 w-full rounded-md border p-3 shadow-sm focus:ring-gray-500 pr-10
        ${errors.contrasena ? "border-red-500" : "border-gray-200"}
      `}
                                            required
                                            maxLength={userValidations.contrasena.maxLength}
                                            onBlur={handleBlur}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-5 text-gray-600"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {errors.contrasena && <p className="text-red-500 text-sm mt-1">{errors.contrasena}</p>}
                                </div>

                                {/* Teléfono */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        className={`bg-transparent text-black mt-1 w-full rounded-md border p-3 shadow-sm focus:ring-gray-500
      ${errors.telefono ? "border-red-500" : "border-gray-200"}
    `}
                                        required
                                        onBlur={handleBlur}
                                        maxLength={userValidations.telefono.maxLength}
                                    />
                                    {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
                                </div>

                                {/* Rol */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Rol</label>
                                    <select
                                        name="idRol"
                                        className={`bg-transparent text-black mt-1 w-full rounded-md border p-3 shadow-sm focus:ring-gray-500
      ${errors.idRol ? "border-red-500" : "border-gray-200"}
    `}
                                        required
                                        onBlur={handleBlur}
                                    >
                                        <option value="">Seleccione un rol</option>
                                        {roles.map((rol) => (
                                            <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                                        ))}
                                    </select>
                                    {errors.idRol && <p className="text-red-500 text-sm mt-1">{errors.idRol}</p>}
                                </div>


                                {/* Botón de Guardar */}
                                <div className="flex justify-center mt-4">
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-primary py-2 px-6 text-white hover:bg-blue-900"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </Form>
                        </div>

                    </section>
                </main>
            </div>
        </div>
    );
}