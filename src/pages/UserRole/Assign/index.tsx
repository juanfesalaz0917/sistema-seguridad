import React, { Suspense } from 'react';
import { useUiLibrary } from '../../../context/UiLibraryContext';

// const TailwindUserRoleAssign = React.lazy(() => import('./Assign.tailwind') as any);
// const BootstrapAdressAssign = React.lazy(() => import('./Assign.bootstrap'));
const MuiUserRoleAssign = React.lazy(() => import('./Assign.mui'));

const UserRoleAssignFacade: React.FC = (props) => {
    const { library } = useUiLibrary();

    let Component = MuiUserRoleAssign;
    // let Component = TailwindUserRoleAssign; // default
    // if (library === 'bootstrap') Component = BootstrapUserRoleAssign;
    if (library === 'mui') Component = MuiUserRoleAssign;

    return (
        <Suspense fallback={<div></div>}>
            {/* @ts-ignore */}
            <Component {...props} />
        </Suspense>
    );
};

export default UserRoleAssignFacade;
