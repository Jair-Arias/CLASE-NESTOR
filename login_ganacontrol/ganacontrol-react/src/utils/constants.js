export const ROLES = {
  ADMIN: 'ADMIN',
  VET: 'VET',
  ENC_GAN: 'ENC_GAN',
  ENC_ALIM: 'ENC_ALIM',
  GERENTE: 'GERENTE',
  USR_BAS: 'USR_BAS'
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.VET]: 'Veterinario',
  [ROLES.ENC_GAN]: 'Encargado de Ganado',
  [ROLES.ENC_ALIM]: 'Encargado de Alimentación',
  [ROLES.GERENTE]: 'Gerente de Finca',
  [ROLES.USR_BAS]: 'Usuario Básico'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/me',
    LOGOUT: '/auth/logout'
  },
  USERS: '/users',
  ANIMALS: '/animals',
  LOTS: '/lots',
  FEEDINGS: '/feedings'
};

export const PASSWORD_REQUIREMENTS = [
  { text: 'Mínimo 8 caracteres', key: 'length' },
  { text: 'Una letra mayúscula', key: 'upperCase' },
  { text: 'Una letra minúscula', key: 'lowerCase' },
  { text: 'Un número', key: 'numbers' },
  { text: 'Un carácter especial', key: 'specialChar' }
];

export const INITIAL_USER_DATA = {
  documento: '',
  nombres: '',
  apellidos: '',
  telefono: '',
  correo: '',
  usuario: '',
  contrasena: '',
  confirmarContrasena: ''
};