import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  required = false,
  icon: Icon,
  className = '',
  disabled = false,
  ...props
}) => {
  const hasError = touched && error;
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-3 rounded-xl border transition-all duration-300
            ${Icon ? 'pl-10' : 'pl-4'}
            ${hasError 
              ? 'border-red-500 bg-red-500/10 focus:ring-2 focus:ring-red-500 focus:border-transparent' 
              : 'border-white/30 bg-white/10 focus:ring-2 focus:ring-green-400 focus:border-transparent'
            }
            text-white placeholder-gray-400
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none
          `}
          {...props}
        />
        
        {hasError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
            <FaExclamationCircle className="w-5 h-5" />
          </div>
        )}
      </div>
      
      {hasError && (
        <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
          <FaExclamationCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;