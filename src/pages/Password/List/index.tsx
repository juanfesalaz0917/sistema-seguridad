import React, { Suspense } from 'react';
import { useUiLibrary } from '../../../context/UiLibraryContext';

// const TailwindPasswordList = React.lazy(() => import('./List.tailwind') as any);
// const BootstrapAdressList = React.lazy(() => import('./List.bootstrap'));
const MuiPasswordList = React.lazy(() => import('./List.mui'));

const PasswordListFacade: React.FC = (props) => {
    const { library } = useUiLibrary();

    let Component = MuiPasswordList;
    // let Component = TailwindPasswordList; // default
    // if (library === 'bootstrap') Component = BootstrapPasswordList;
    if (library === 'mui') Component = MuiPasswordList;

    return (
        <Suspense fallback={<div></div>}>
            {/* @ts-ignore */}
            <Component {...props} />
        </Suspense>
    );
};

export default PasswordListFacade;
