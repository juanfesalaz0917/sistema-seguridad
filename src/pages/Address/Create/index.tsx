import React, { Suspense } from 'react';
import { useUiLibrary } from '../../../context/UiLibraryContext';

// const TailwindAddressCreate = React.lazy(() => import('./Create.tailwind') as any);
// const BootstrapAdressCreate = React.lazy(() => import('./Create.bootstrap'));
const MuiAddressCreate = React.lazy(() => import('./Create.mui'));

const AddressCreateFacade: React.FC = (props) => {
    const { library } = useUiLibrary();

    let Component = MuiAddressCreate;
    // let Component = TailwindAddressCreate; // default
    // if (library === 'bootstrap') Component = BootstrapAddressCreate;
    if (library === 'mui') Component = MuiAddressCreate;

    return (
        <Suspense fallback={<div></div>}>
            {/* @ts-ignore */}
            <Component {...props} />
        </Suspense>
    );
};

export default AddressCreateFacade;
