import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { authService } from '../../services/authService';
import useForm from '../../hooks/useForm';
import { validators } from '../../utils/validators';

const Login = () => {
  const navigate = useNavigate();
  const [showTestCredentials, setShowTestCredentials] = useState(false);
  
  // Validación personalizada para login
  const validateLogin = (name, value) => {
    if (name === 'correo') {
      return validators.email(value);
    }
    if (name === 'contrasena') {
      return validators.password(value);
    }
    return '';
  };
  
  const { 
    formData, 
    errors, 
    touched, 
    isSubmitting,
    handleChange, 
    handleBlur, 
    handleSubmit 
  } = useForm({
    correo: '',
    contrasena: ''
  }, validateLogin);
  
  const onSubmit = async (data) => {
    try {
      await authService.login(data.correo, data.contrasena);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error en login:', error);
    }
  };
  
  const fillTestCredentials = () => {
    handleChange({
      target: {
        name: 'correo',
        value: 'admin@sistema.com'
      }
    });
    
    handleChange({
      target: {
        name: 'contrasena',
        value: 'Admin123*'
      }
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>
      
      {/* Tarjeta de login */}
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shadow-2xl mb-4 animate-float">
            <span className="text-3xl font-bold text-white">GC</span>
          </div>
          <h1 className="text-4xl font-bold text-white text-center mb-2">GanaControl</h1>
          <p className="text-gray-300 text-center">Sistema de Gestión Ganadera</p>
        </div>
        
        <div className="glass-effect rounded-2xl p-8 shadow-ganadero">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Iniciar Sesión
          </h2>
          <p className="text-gray-300 text-center mb-8">
            Ingresa tus credenciales para acceder al sistema
          </p>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Correo Electrónico"
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="tu@correo.com"
              error={errors.correo}
              touched={touched.correo}
              required
              icon={FaEnvelope}
            />
            
            <Input
              label="Contraseña"
              type="password"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="••••••••"
              error={errors.contrasena}
              touched={touched.contrasena}
              required
              icon={FaLock}
            />
            
            {/* Credenciales de prueba (solo desarrollo) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => setShowTestCredentials(!showTestCredentials)}
                  className="text-sm text-green-400 hover:text-green-300 mb-2"
                >
                  {showTestCredentials ? 'Ocultar' : 'Mostrar'} credenciales de prueba
                </button>
                
                {showTestCredentials && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <p className="text-yellow-300 text-sm mb-2">
                      <strong>Para desarrollo:</strong>
                    </p>
                    <p className="text-yellow-300 text-sm mb-2">
                      Email: admin@sistema.com
                    </p>
                    <p className="text-yellow-300 text-sm mb-3">
                      Contraseña: Admin123*
                    </p>
                    <Button
                      type="button"
                      variant="secondary"
                      size="small"
                      onClick={fillTestCredentials}
                      className="w-full"
                    >
                      Usar credenciales de prueba
                    </Button>
                 