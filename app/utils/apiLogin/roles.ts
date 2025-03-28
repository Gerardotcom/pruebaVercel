export const ROLES = {
    Administrador: "Administrador",
    Tecnico: "Tecnico",
    Cliente: "Cliente",
  };
  
  export const PERMISOS = {
    [ROLES.Administrador]: ["dashboard", "usuarios", "tickets", "reportes"],
    [ROLES.Tecnico]: ["dashboard", "tickets"],
    [ROLES.Cliente]: ["dashboard", "crear-ticket"],
  };
  