import { forwardRef, useId } from 'react';

interface InputProps {
    id?: string;
    label?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    helperText?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'number';
    name?: string;
    className?: string;
    min?: string | number;
    step?: string | number;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, required, disabled, helperText, value, onChange, placeholder, type = 'text', name, id, className = '', min, step }, ref) => {
        const generatedId = useId();
        const fieldId = id ?? name ?? generatedId;

        return (
            <div className={`w-full ${className}`}>
                {label && (
                    <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <input
                    ref={ref}
                    id={fieldId}
                    type={type}
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    min={min}
                    step={step}
                    className={`
                        w-full px-3 py-2 border rounded-lg shadow-sm
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                        ${error ? 'border-red-500' : 'border-gray-300'}
                        ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                    `}
                />
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';