import { useState, useCallback } from 'react';
import { validators } from '../utils/validators';

const useForm = (initialState, validateFn = null) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejar cambios en los inputs
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Si el campo fue tocado, validar inmediatamente
    if (touched[name]) {
      validateField(name, type === 'checkbox' ? checked : value);
    }
  }, [touched]);

  // Manejar blur (cuando el campo pierde el foco)
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    validateField(name, value);
  }, []);

  // Validar un campo específico
  const validateField = useCallback((name, value) => {
    if (validateFn) {
      const error = validateFn(name, value, formData);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    } else if (validators[name]) {
      // Usar validadores por defecto si existen
      const error = validators[name](value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [formData, validateFn]);

  // Validar todo el formulario
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;
    
    Object.keys(formData).forEach(key => {
      let error = '';
      
      if (validateFn) {
        error = validateFn(key, formData[key], formData);
      } else if (validators[key]) {
        // Validación especial para confirmación de contraseña
        if (key === 'confirmarContrasena') {
          error = validators.confirmPassword(formData.contrasena, formData.confirmarContrasena);
        } else {
          error = validators[key](formData[key]);
        }
      }
      
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    return isValid;
  }, [formData, validateFn]);

  // Resetear formulario
  const resetForm = useCallback(() => {
    setFormData(initialState);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialState]);

  // Manejar submit
  const handleSubmit = useCallback((submitFn) => async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    
    try {
      await submitFn(formData);
    } catch (error) {
      console.error('Error en submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  // Establecer valores manualmente
  const setFieldValue = useCallback((name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (touched[name]) {
      validateField(name, value);
    }
  }, [touched, validateField]);

  // Establecer múltiples valores
  const setValues = useCallback((values) => {
    setFormData(prev => ({
      ...prev,
      ...values
    }));
  }, []);

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setValues,
    validateForm
  };
};

export default useForm;