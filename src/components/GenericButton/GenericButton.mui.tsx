import type React from 'react';
import { Button as MuiButton } from '@mui/material';
import { GenericButtonProps } from '.';

export const GenericButtonMui: React.FC<GenericButtonProps> = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    disabled = false,
    className = '',
}) => {
    const getButtonProps = () => {
        switch (variant) {
            case 'primary':
                return {
                    variant: 'outlined' as const,
                    color: 'primary' as const,
                };
            case 'secondary':
                return {
                    variant: 'outlined' as const,
                    color: 'inherit' as const,
                };
            case 'danger':
                return {
                    variant: 'contained' as const,
                    color: 'error' as const,
                };
            case 'success':
                return {
                    variant: 'contained' as const,
                    color: 'success' as const,
                };
            default:
                return {
                    variant: 'outlined' as const,
                    color: 'primary' as const,
                };
        }
    };

    const { variant: muiVariant, color: muiColor } = getButtonProps();

    return (
        <MuiButton
            type={type}
            onClick={onClick}
            variant={muiVariant}
            color={muiColor}
            disabled={disabled}
            className={className}
            sx={{ mr: 1 }}
        >
            {children}
        </MuiButton>
    );
};

export default GenericButtonMui;
