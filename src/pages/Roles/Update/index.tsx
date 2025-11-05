import React, { Suspense } from 'react';
import { useUiLibrary } from '../../../context/UiLibraryContext';

// const TailwindRoleUpdate = React.lazy(() => import('./Update.tailwind') as any);
// const BootstrapAdressUpdate = React.lazy(() => import('./Update.bootstrap'));
const MuiRoleUpdate = React.lazy(() => import('./Update.mui'));

const RoleUpdateFacade: React.FC = (props) => {
    const { library } = useUiLibrary();

    let Component = MuiRoleUpdate;
    // let Component = TailwindRoleUpdate; // default
    // if (library === 'bootstrap') Component = BootstrapRoleUpdate;
    if (library === 'mui') Component = MuiRoleUpdate;

    return (
        <Suspense fallback={<div></div>}>
            {/* @ts-ignore */}
            <Component {...props} />
        </Suspense>
    );
};

export default RoleUpdateFacade;
