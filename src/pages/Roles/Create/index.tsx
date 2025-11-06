import React, { Suspense } from 'react';
import { useUiLibrary } from '../../../context/UiLibraryContext';

// const TailwindRoleCreate = React.lazy(() => import('./Create.tailwind') as any);
// const BootstrapAdressCreate = React.lazy(() => import('./Create.bootstrap'));
const MuiRoleCreate = React.lazy(() => import('./Create.mui'));

const RoleCreateFacade: React.FC = (props) => {
    const { library } = useUiLibrary();

    let Component = MuiRoleCreate;
    // let Component = TailwindRoleCreate; // default
    // if (library === 'bootstrap') Component = BootstrapRoleCreate;
    if (library === 'mui') Component = MuiRoleCreate;

    return (
        <Suspense fallback={<div></div>}>
            {/* @ts-ignore */}
            <Component {...props} />
        </Suspense>
    );
};

export default RoleCreateFacade;