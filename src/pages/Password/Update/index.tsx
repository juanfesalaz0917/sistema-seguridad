import React, { Suspense } from 'react';
import { useUiLibrary } from '../../../context/UiLibraryContext';

// const TailwindPasswordUpdate = React.lazy(() => import('./Update.tailwind') as any);
// const BootstrapAdressUpdate = React.lazy(() => import('./Update.bootstrap'));
const MuiPasswordUpdate = React.lazy(() => import('./Update.mui'));

const PasswordUpdateFacade: React.FC = (props) => {
    const { library } = useUiLibrary();

    let Component = MuiPasswordUpdate;
    // let Component = TailwindPasswordUpdate; // default
    // if (library === 'bootstrap') Component = BootstrapPasswordUpdate;
    if (library === 'mui') Component = MuiPasswordUpdate;

    return (
        <Suspense fallback={<div></div>}>
            {/* @ts-ignore */}
            <Component {...props} />
        </Suspense>
    );
};

export default PasswordUpdateFacade;
