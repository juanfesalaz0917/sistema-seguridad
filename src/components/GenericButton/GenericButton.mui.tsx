import type React from 'react';
import { Button as MuiButton } from '@mui/material';
import { GenericButtonProps } from '.';

export const GenericButtonMui: React.FC<GenericButtonProps> = ({
    children,
    onClick,
    type = 'button',
    disabled = false,
    className = '',
}) => {
    const muiVariant = 'outlined';
    const muiColor = 'primary';

    return (
        <MuiButton
            type={type}
            onClick={onClick}
            variant={muiVariant}
            color={muiColor}
            disabled={disabled}
            className={className}
            style={{ marginRight: 3 }}
        >
            {children}
        </MuiButton>
    );
};

export default GenericButtonMui;
