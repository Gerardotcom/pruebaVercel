export type Ticket = {
    idTicket: number;
    descripcion: string;
    idCliente: number;
    idAsset: number;
    idTecnico?: number; // Puede ser nulo
    estado: string;
    tipoMantenimiento: string;
    fechaAlta: string; // Date convertido a string para JSON
    prioridad: string;
    nombreCliente?: string;
    nombreAsset?: string;
    nombreTecnico?: string;
};

