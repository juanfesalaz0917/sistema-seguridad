import { List } from 'lucide-react';
import { lazy } from 'react';
import UpdateUser from '../pages/Users/Update';
import UpdateDigitalSignature from '../pages/DigitalSignature/updateDigitalSignature';
import ViewDigitalSignature from '../pages/DigitalSignature/ViewDigitalSignature';
import { Devices } from '@mui/icons-material';
import DevicesListBootstrap from '../pages/Devices/DevicesList.bootstrap';

const Calendar = lazy(() => import('../pages/Calendar'));
const CreateUser = lazy(() => import('../pages/Users/Create'));
const ViewUser = lazy(() => import('../pages/Users/View'));
const ViewAddress = lazy(() => import('../pages/Address/View'));
const CreateAddress = lazy(() => import('../pages/Address/Create'));
const UpdateAddress = lazy(() => import('../pages/Address/Update'));
const Chart = lazy(() => import('../pages/Chart'));
const FormElements = lazy(() => import('../pages/Form/FormElements'));
const FormLayout = lazy(() => import('../pages/Form/FormLayout'));
const Settings = lazy(() => import('../pages/Settings'));
const Tables = lazy(() => import('../pages/Tables'));
const Alerts = lazy(() => import('../pages/UiElements/Alerts'));
const Buttons = lazy(() => import('../pages/UiElements/Buttons'));
const Demo = lazy(() => import('../pages/Demo'));
const ListUsers = lazy(() => import('../pages/Users/ListUsers'));
const RolesList = lazy(() => import('../pages/Roles/RolesList'));
const ListPermission = lazy(() => import('../pages/Permission/ListPermission'));
const CreatePermission = lazy(() => import('../pages/Permission/CreatePermission'));
const UpdatePermission = lazy(() => import('../pages/Permission/UpdatePermission'));
const ViewPermission = lazy(() => import('../pages/Permission/ViewPermission'));
const ViewProfile = lazy(() => import('../pages/Profile/ViewProfile'));
const UpdateProfile = lazy(() => import('../pages/Profile/UpdateProfile'));
import ListRolesPermission from "../pages/RolePermission/ListRolePermission";

const coreRoutes = [

    {
        path: '/user/devices/:userId',
        component: DevicesListBootstrap,
        title: 'Disposotivos',
    },
    {
        path: '/user/digital-signature/:userId',
        component: ViewDigitalSignature,
        title: 'Firma Digital',
    },
    {
        path: '/user/digital-signature/update/:userId',
        component: UpdateDigitalSignature,
        title: 'Actualizar Firma Digital',
    },
    {
        path: '/demo',
        title: 'Demo',
        component: Demo,
    },
    {
        path: '/user/list',
        title: 'List Users',
        component: ListUsers,
    },
    {
        path: '/user/create',
        title: 'Create Users',
        component: CreateUser,
    },
    {
        path: '/user/update/:id',
        title: 'Update Users',
        component: UpdateUser,
    },
    {
        path: '/user/view/:userId',
        title: 'View Users',
        component: ViewUser,
    },
    {
        path: '/user/address/:userId',
        title: 'View Address',
        component: ViewAddress,
    },
    {
        path: '/user/address/create/:userId',
        title: 'Create Address',
        component: CreateAddress,
    },
    {
        path: '/user/address/update/:userId',
        title: 'Update Address',
        component: UpdateAddress,
    },
    {
        path: '/roles/list',
        title: 'Roles List',
        component: RolesList,
    },
    {
        path: '/calendar',
        title: 'Calender',
        component: Calendar,
    },
    {
        path: '/forms/form-elements',
        title: 'Forms Elements',
        component: FormElements,
    },
    {
        path: '/forms/form-layout',
        title: 'Form Layouts',
        component: FormLayout,
    },
    {
        path: '/tables',
        title: 'Tables',
        component: Tables,
    },
    {
        path: '/settings',
        title: 'Settings',
        component: Settings,
    },
    {
        path: '/chart',
        title: 'Chart',
        component: Chart,
    },
    {
        path: '/ui/alerts',
        title: 'Alerts',
        component: Alerts,
    },
    {
        path: '/ui/buttons',
        title: 'Buttons',
        component: Buttons,
    },
    {
        path: '/permissions/list',
        title: 'List Permission',
        component: ListPermission,
    },
    {
        path: '/permissions/create',
        title: 'Create Permission',
        component: CreatePermission,
    },
    {
        path: '/permissions/view/:id',
        title: 'View Permission',
        component: ViewPermission,
    },
    {
        path: '/permissions/update/:id',
        title: 'Update Permission',
        component: UpdatePermission,
    },

    {
        path: '/profiles/:id',
        title: 'View Profile',
        component: ViewProfile,
    },
    {
        path: '/profiles/update/:id',
        title: 'Update Profile',
        component: UpdateProfile,
    },
    {
        path: '/permissions/grouped/role/:roleId',
        title: 'Assign Permissions',
        component: ListRolesPermission, // Asegúrate de que esté importado correctamente
    }
];

const routes = [...coreRoutes];
export default routes;
