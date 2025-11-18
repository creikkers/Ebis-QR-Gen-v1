import React from 'react';
import { Lock, Unlock } from 'lucide-react';

interface FormInputProps {
  label: string;
  id: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  options?: { label: string; value: string }[];
  className?: string;
  isLocked?: boolean;
  onToggleLock?: () => void;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  helperText,
  options,
  className = '',
  isLocked = false,
  onToggleLock
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex justify-between items-end mb-1">
        <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {onToggleLock && (
          <button
            type="button"
            onClick={onToggleLock}
            className={`p-1 rounded-md transition-colors ${
              isLocked 
                ? 'text-orange-600 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400' 
                : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
            }`}
            title={isLocked ? "Düzenlemeye aç" : "Düzenlemeye kapat (Sabitle)"}
          >
            {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
          </button>
        )}
      </div>
      
      {options ? (
        <div className="relative">
          <select
            id={id}
            name={name || id}
            value={value}
            onChange={onChange}
            disabled={isLocked}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 text-sm transition-colors appearance-none
              ${isLocked 
                ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700' 
                : 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400'
              }`}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="relative">
          <input
            type={type}
            id={id}
            name={name || id}
            value={value}
            onChange={onChange}
            readOnly={isLocked}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 text-sm transition-colors
              ${isLocked 
                ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700' 
                : 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400'
              }`}
          />
        </div>
      )}
      
      {helperText && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
};