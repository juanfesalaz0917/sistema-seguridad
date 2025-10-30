import type React from 'react';
import { GenericButtonProps } from '.';

export const GenericButtonTailwind: React.FC<GenericButtonProps> = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    disabled = false,
    className = '',
}) => {
    const tailwindClasses = {
        primary: 'bg-primary text-white hover:bg-opacity-90',
        secondary:
            'border border-stroke text-black dark:text-white hover:shadow-1',
        danger: 'bg-meta-1 text-white hover:bg-opacity-90',
        success: 'bg-success text-white hover:bg-opacity-90',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center justify-center rounded-md px-6 py-3 text-center font-medium transition ${
                tailwindClasses[variant]
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {children}
        </button>
    );
};

export default GenericButtonTailwind;
