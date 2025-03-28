import { Cliente } from "./cliente";

export interface ApiResponse {
  clientes: Cliente[];
  totalRecords: number; // Cambia "total" por "totalRegistros"
}

export const getClientes = async (
  pageNumber: number,
  pageSize: number
): Promise<ApiResponse> => {
  try {
    const response = await fetch(
      `https://localhost:7014/api/Cliente/Listar?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );

    if (!response.ok) {
      throw new Error("Error al obtener los clientes");
    }

    const data = await response.json();
    return { clientes: data.data, totalRecords: data.totalRecords }; // Cambia "total" por "totalRegistros"
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return { clientes: [], totalRecords: 0 }; // Cambia "total" por "totalRegistros"
  }
};