import React, { Suspense } from 'react';
import { useUiLibrary } from '../../../context/UiLibraryContext';

// const TailwindAddressUpdate = React.lazy(() => import('./Update.tailwind') as any);
// const BootstrapAdressUpdate = React.lazy(() => import('./Update.bootstrap'));
const MuiAddressUpdate = React.lazy(() => import('./Update.mui'));

const AddressUpdateFacade: React.FC = (props) => {
    const { library } = useUiLibrary();

    let Component = MuiAddressUpdate;
    // let Component = TailwindAddressUpdate; // default
    // if (library === 'bootstrap') Component = BootstrapAddressUpdate;
    if (library === 'mui') Component = MuiAddressUpdate;

    return (
        <Suspense fallback={<div></div>}>
            {/* @ts-ignore */}
            <Component {...props} />
        </Suspense>
    );
};

export default AddressUpdateFacade;
