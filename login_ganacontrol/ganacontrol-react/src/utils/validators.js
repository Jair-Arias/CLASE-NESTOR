export const validators = {
  // Validar email
  email: (value) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return 'El correo es requerido';
    if (!re.test(value)) return 'Correo electrónico inválido';
    return '';
  },
  
  // Validar contraseña
  password: (value) => {
    if (!value) return 'La contraseña es requerida';
    if (value.length < 8) return 'Mínimo 8 caracteres';
    
    const requirements = {
      upperCase: /[A-Z]/.test(value),
      lowerCase: /[a-z]/.test(value),
      numbers: /\d/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value)
    };
    
    if (!requirements.upperCase) return 'Debe tener al menos una mayúscula';
    if (!requirements.lowerCase) return 'Debe tener al menos una minúscula';
    if (!requirements.numbers) return 'Debe tener al menos un número';
    if (!requirements.specialChar) return 'Debe tener al menos un carácter especial';
    
    return '';
  },
  
  // Validar confirmación de contraseña
  confirmPassword: (password, confirmPassword) => {
    if (!confirmPassword) return 'Confirma tu contraseña';
    if (password !== confirmPassword) return 'Las contraseñas no coinciden';
    return '';
  },
  
  // Validar documento
  document: (value) => {
    if (!value) return 'El documento es requerido';
    if (!/^\d+$/.test(value)) return 'Solo se permiten números';
    if (value.length < 8) return 'Mínimo 8 dígitos';
    if (value.length > 20) return 'Máximo 20 dígitos';
    return '';
  },
  
  // Validar nombres
  names: (value) => {
    if (!value) return 'Este campo es requerido';
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return 'Solo letras y espacios';
    if (value.length < 2) return 'Mínimo 2 caracteres';
    if (value.length > 100) return 'Máximo 100 caracteres';
    return '';
  },
  
  // Validar teléfono
  phone: (value) => {
    if (!value) return ''; // Opcional
    if (!/^\d{10}$/.test(value)) return 'Debe tener 10 dígitos';
    return '';
  },
  
  // Validar usuario
  username: (value) => {
    if (!value) return 'El usuario es requerido';
    if (value.length < 3) return 'Mínimo 3 caracteres';
    if (value.length > 50) return 'Máximo 50 caracteres';
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Solo letras, números y guiones bajos';
    return '';
  }
};