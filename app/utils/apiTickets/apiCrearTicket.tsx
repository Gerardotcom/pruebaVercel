export async function crearTicket(ticketData: any) {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch("https://localhost:7054/api/Tickets/crear", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(ticketData)
        });

        const contentType = response.headers.get("Content-Type");

        if (!response.ok) {
            const errorData = contentType?.includes("application/json")
                ? await response.json()
                : await response.text(); // 👈 Manejar texto plano
            throw new Error(errorData || "Error desconocido en el servidor");
        }

        return contentType?.includes("application/json")
            ? await response.json()
            : await response.text();
    } catch (error) {
        console.error("Error en la creación del ticket:", error);
        throw error;
    }
}
