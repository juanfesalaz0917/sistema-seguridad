import React, { Suspense } from 'react';
import { useUiLibrary } from '../../../context/UiLibraryContext';

// const TailwindUserView = React.lazy(() => import('./View.tailwind') as any);
// const BootstrapUserView = React.lazy(() => import('./View.bootstrap'));
const MuiUserView = React.lazy(() => import('./View.mui'));

const UserViewFacade: React.FC = (props) => {
    const { library } = useUiLibrary();

    let Component = MuiUserView;
    // let Component = TailwindUserView; // default
    // if (library === 'bootstrap') Component = BootstrapUserView;
    if (library === 'mui') Component = MuiUserView;

    return (
        <Suspense fallback={<div></div>}>
            {/* @ts-ignore */}
            <Component {...props} />
        </Suspense>
    );
};

export default UserViewFacade;
