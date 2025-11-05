import React, { Suspense } from 'react';
import { useUiLibrary } from '../../../context/UiLibraryContext';

// const TailwindRoleList = React.lazy(() => import('./List.tailwind') as any);
// const BootstrapAdressList = React.lazy(() => import('./List.bootstrap'));
const MuiRoleList = React.lazy(() => import('./List.mui'));

const RoleListFacade: React.FC = (props) => {
    const { library } = useUiLibrary();

    let Component = MuiRoleList;
    // let Component = TailwindRoleList; // default
    // if (library === 'bootstrap') Component = BootstrapRoleList;
    if (library === 'mui') Component = MuiRoleList;

    return (
        <Suspense fallback={<div></div>}>
            {/* @ts-ignore */}
            <Component {...props} />
        </Suspense>
    );
};

export default RoleListFacade;
