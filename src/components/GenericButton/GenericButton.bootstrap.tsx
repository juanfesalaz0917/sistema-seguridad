import type React from 'react';
import { Button as BootstrapButton } from 'react-bootstrap';
import { GenericButtonProps } from '.';

export const GenericButtonBootstrap: React.FC<GenericButtonProps> = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    disabled = false,
    className = '',
}) => {
    const bsVariant =
        variant === 'danger'
            ? 'danger'
            : variant === 'success'
            ? 'success'
            : variant === 'secondary'
            ? 'secondary'
            : 'primary';

    return (
        <BootstrapButton
            type={type}
            onClick={onClick}
            variant={bsVariant}
            disabled={disabled}
            className={className}
        >
            {children}
        </BootstrapButton>
    );
};

export default GenericButtonBootstrap;
