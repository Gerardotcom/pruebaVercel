import { useState, useEffect } from "react";
import { Usuario, Role } from "./usuarioRol";

const API_URL = "http://localhost:5008//api"; // Reemplaza con la URL de tu API

export const useCrearUsuario = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      fetchRoles();
    }, []);
  
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${API_URL}/Usuario/roles`);
        if (!response.ok) throw new Error("Error al obtener roles");
        const data = await response.json();
        setRoles(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
  
    const registrarUsuario = async (usuario: any) => {
        setLoading(true);
        setError(null);
        try {
            console.log("Enviando solicitud con los siguientes datos:", usuario);
            const response = await fetch(`${API_URL}/Usuario/registrar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(usuario),
            });
    
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.mensaje || "Error al registrar usuario");
            }
    
            const data = await response.json();
            console.log("Usuario registrado correctamente:", data);
    
            alert("Usuario registrado correctamente");
            return data;
        } catch (err: any) {
            console.error("Error al registrar usuario:", err);
            setError(err.message);
            alert(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };    
  
    return { roles, loading, error, registrarUsuario };
  };
  