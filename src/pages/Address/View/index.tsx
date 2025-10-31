import React, { Suspense } from 'react';
import { useUiLibrary } from '../../../context/UiLibraryContext';

// const TailwindAddressView = React.lazy(() => import('./View.tailwind') as any);
// const BootstrapAdressView = React.lazy(() => import('./View.bootstrap'));
const MuiAddressView = React.lazy(() => import('./View.mui'));

const AddressViewFacade: React.FC = (props) => {
    const { library } = useUiLibrary();

    let Component = MuiAddressView;
    // let Component = TailwindAddressView; // default
    // if (library === 'bootstrap') Component = BootstrapAddressView;
    if (library === 'mui') Component = MuiAddressView;

    return (
        <Suspense fallback={<div></div>}>
            {/* @ts-ignore */}
            <Component {...props} />
        </Suspense>
    );
};

export default AddressViewFacade;
