import { apiService } from './api';
import Swal from 'sweetalert2';

class AuthService {
  // Login
  async login(email, password) {
    try {
      const response = await apiService.post('/auth/login', {
        correo: email,
        contrasena: password
      });
      
      if (response.data.success) {
        this.setAuthData(response.data);
        
        await Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: response.data.message,
          timer: 2000,
          showConfirmButton: false,
          background: '#f0fdf4',
          color: '#166534'
        });
        
        return response.data;
      }
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  // Registro
  async register(userData) {
    try {
      const response = await apiService.post('/auth/register', userData);
      
      if (response.data.success) {
        await Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: response.data.message,
          timer: 3000,
          showConfirmButton: false,
          background: '#f0fdf4',
          color: '#166534'
        });
        
        return response.data;
      }
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  // Obtener perfil
  async getProfile() {
    try {
      const response = await apiService.get('/auth/me');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    Swal.fire({
      icon: 'info',
      title: 'Sesión cerrada',
      text: 'Has cerrado sesión exitosamente.',
      timer: 2000,
      showConfirmButton: false,
      background: '#fef3c7',
      color: '#78350f'
    });
    
    window.location.href = '/login';
  }
  
  // Guardar datos de autenticación
  setAuthData(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  
  // Obtener usuario actual
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  
  // Verificar si está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
  
  // Manejo de errores
  handleError(error) {
    let message = 'Ocurrió un error inesperado.';
    
    if (error.response) {
      message = error.response.data.message || message;
      
      // Errores de validación
      if (error.response.data.errors) {
        const errors = error.response.data.errors.map(err => err.msg).join('<br>');
        Swal.fire({
          icon: 'error',
          title: 'Errores de validación',
          html: errors,
          background: '#fef2f2',
          color: '#dc2626'
        });
        return;
      }
    } else if (error.request) {
      message = 'Error de conexión. Verifica tu internet.';
    }
    
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      background: '#fef2f2',
      color: '#dc2626'
    });
  }
  
  // Validaciones
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  validatePassword(password) {
    const requirements = {
      length: password.length >= 8,
      upperCase: /[A-Z]/.test(password),
      lowerCase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const isValid = Object.values(requirements).every(req => req);
    
    return {
      isValid,
      requirements
    };
  }
}

export const authService = new AuthService();