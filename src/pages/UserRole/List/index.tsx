import React, { Suspense } from 'react';
import { useUiLibrary } from '../../../context/UiLibraryContext';

// const TailwindUserRoleList = React.lazy(() => import('./List.tailwind') as any);
// const BootstrapAdressList = React.lazy(() => import('./List.bootstrap'));
const MuiUserRoleList = React.lazy(() => import('./List.mui'));

const UserRoleListFacade: React.FC = (props) => {
    const { library } = useUiLibrary();

    let Component = MuiUserRoleList;
    // let Component = TailwindUserRoleList; // default
    // if (library === 'bootstrap') Component = BootstrapUserRoleList;
    if (library === 'mui') Component = MuiUserRoleList;

    return (
        <Suspense fallback={<div></div>}>
            {/* @ts-ignore */}
            <Component {...props} />
        </Suspense>
    );
};

export default UserRoleListFacade;
