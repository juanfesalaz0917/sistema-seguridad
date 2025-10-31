// src/components/Sidebar/index.tsx
import React, { Suspense } from 'react';
import { useUiLibrary } from '../../context/UiLibraryContext';
import type { SidebarProps } from './types';

const TailwindSidebar = React.lazy(() => import('./Sidebar.tailwind') as any);
const BootstrapSidebar = React.lazy(() => import('./Sidebar.bootstrap'));
const MuiSidebar = React.lazy(() => import('./Siderbar.mui'));

const SidebarFacade: React.FC<SidebarProps> = (props) => {
    const { library } = useUiLibrary();

    let Component = TailwindSidebar; // default
    if (library === 'bootstrap') Component = BootstrapSidebar;
    if (library === 'mui') Component = MuiSidebar;

    return (
        <Suspense fallback={<div style={{ width: 280 }}></div>}>
            {/* @ts-ignore */}
            <Component {...props} />
        </Suspense>
    );
};

export default SidebarFacade;
