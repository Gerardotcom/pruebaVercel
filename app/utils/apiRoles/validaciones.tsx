export const userValidations = {
    nombre: { maxLength: 80, minLength: 3 },
    correo: { maxLength: 80, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    contrasena: {
      minLength: 8,
      maxLength: 20,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/,
    },
    telefono: { maxLength: 10, pattern: /^[0-9]+$/ },
    idRol: { required: true },
  };
  