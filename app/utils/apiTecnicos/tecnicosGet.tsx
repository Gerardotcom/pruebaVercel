import { Tecnico } from "./tecnico";

export interface ApiResponse {
  tecnicos: Tecnico[];
  totalRegistros: number; // Cambia "total" por "totalRegistros"
}

export const getTecnicos = async (
  estado: string | null,
  pageNumber: number,
  pageSize: number
): Promise<ApiResponse> => {
  try {
    const response = await fetch(
      `https://localhost:7177/api/tecnicos/listar?estado=${estado || ""}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );

    if (!response.ok) {
      throw new Error("Error al obtener los técnicos");
    }

    const data = await response.json();
    return { tecnicos: data.tecnicos, totalRegistros: data.totalRegistros }; // Cambia "total" por "totalRegistros"
  } catch (error) {
    console.error("Error al obtener técnicos:", error);
    return { tecnicos: [], totalRegistros: 0 }; // Cambia "total" por "totalRegistros"
  }
};