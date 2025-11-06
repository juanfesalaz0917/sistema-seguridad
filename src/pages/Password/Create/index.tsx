import React, { Suspense } from 'react';
import { useUiLibrary } from '../../../context/UiLibraryContext';

// const TailwindPasswordCreate = React.lazy(() => import('./Create.tailwind') as any);
// const BootstrapAdressCreate = React.lazy(() => import('./Create.bootstrap'));
const MuiPasswordCreate = React.lazy(() => import('./Create.mui'));

const PasswordCreateFacade: React.FC = (props) => {
    const { library } = useUiLibrary();

    let Component = MuiPasswordCreate;
    // let Component = TailwindPasswordCreate; // default
    // if (library === 'bootstrap') Component = BootstrapPasswordCreate;
    if (library === 'mui') Component = MuiPasswordCreate;

    return (
        <Suspense fallback={<div></div>}>
            {/* @ts-ignore */}
            <Component {...props} />
        </Suspense>
    );
};

export default PasswordCreateFacade;
