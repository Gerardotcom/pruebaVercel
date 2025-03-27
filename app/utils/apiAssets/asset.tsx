export type Asset = {
    idAsset: number;
    nombreAsset: string;
    numModelo: string;
    numSerie: string;
    marca: string;
    descripcion: string;
    capacidad: string;
    fechaAdquisicion: string;
    ubicacion: string;
    estado: "En uso" | "Dañado" | "En reparacion";
    ticketsRelacionados: number;
    idCliente: number;
}
