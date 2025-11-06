// src/components/Header/index.tsx
import React, { Suspense } from 'react';
import { useUiLibrary } from '../../context/UiLibraryContext';

const HeaderTailwind = React.lazy(() => import('./Header.tailwind'));
const HeaderMui = React.lazy(() => import('./Header.mui'));

interface HeaderProps {
    sidebarOpen: string | boolean | undefined;
    setSidebarOpen: (arg: boolean) => void;
}

const Header: React.FC<HeaderProps> = (props) => {
    const { library } = useUiLibrary();

    let Component = HeaderTailwind;
    // let Component = TailwindPasswordCreate; // default
    // if (library === 'bootstrap') Component = BootstrapPasswordCreate;
    if (library === 'mui') Component = HeaderMui;

    return (
        <Suspense fallback={<div style={{ height: 80, background: '#fff' }} />}>
            {/* @ts-ignore */}
            <Component {...props} />
        </Suspense>
    );
};

export default Header;
