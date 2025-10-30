import React, { Suspense } from 'react';
import { useUiLibrary } from '../../context/UiLibraryContext';

export interface GenericButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    disabled?: boolean;
    className?: string;
}

const TailwindButton = React.lazy(() => import('./GenericButton.tailwind'));
const BootstrapButton = React.lazy(() => import('./GenericButton.bootstrap'));
const MuiButton = React.lazy(() => import('./GenericButton.mui'));

const GenericButton: React.FC<GenericButtonProps> = (props) => {
    const { library } = useUiLibrary();

    let Component = TailwindButton;
    if (library === 'bootstrap') Component = BootstrapButton;
    if (library === 'mui') Component = MuiButton;

    return (
        <Suspense fallback={<div>Loading button...</div>}>
            {/* @ts-ignore */}
            <Component {...props} />
        </Suspense>
    );
};

export default GenericButton;
