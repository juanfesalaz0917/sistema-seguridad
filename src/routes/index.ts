import { lazy } from 'react';
import UpdateUser from '../pages/Users/Update';
const Calendar = lazy(() => import('../pages/Calendar'));
const CreateUser = lazy(() => import('../pages/Users/Create'));
const ViewUser = lazy(() => import('../pages/Users/View'));
const ViewAddress = lazy(() => import('../pages/Address/View'));
const CreateAddress = lazy(() => import('../pages/Address/Create'));
const UpdateAddress = lazy(() => import('../pages/Address/Update'));
const CreateRole = lazy(() => import('../pages/Roles/Create'));
const Chart = lazy(() => import('../pages/Chart'));
const FormElements = lazy(() => import('../pages/Form/FormElements'));
const FormLayout = lazy(() => import('../pages/Form/FormLayout'));
const Settings = lazy(() => import('../pages/Settings'));
const Tables = lazy(() => import('../pages/Tables'));
const Alerts = lazy(() => import('../pages/UiElements/Alerts'));
const Buttons = lazy(() => import('../pages/UiElements/Buttons'));
const Demo = lazy(() => import('../pages/Demo'));
const ListUsers = lazy(() => import('../pages/Users/ListUsers'));
const RolesList = lazy(() => import('../pages/Roles/List'));
const RoleUpdate = lazy(() => import('../pages/Roles/Update'));
const ListPermission = lazy(() => import('../pages/Permission/ListPermission'));
const CreatePermission = lazy(
    () => import('../pages/Permission/CreatePermission'),
);
const UpdatePermission = lazy(
    () => import('../pages/Permission/UpdatePermission'),
);
const ViewPermission = lazy(() => import('../pages/Permission/ViewPermission'));
const ViewProfile = lazy(() => import('../pages/Profile/ViewProfile'));
const UpdateProfile = lazy(() => import('../pages/Profile/UpdateProfile'));
const DevicesList = lazy(() => import('../pages/Devices'));
const DigitalSignature = lazy(() => import('../pages/DigitalSignature'));
const SecurityQuestions = lazy(() => import('../pages/SecurityQuestion'));
const ListPasswords = lazy(() => import('../pages/Password/List'));
const CreatePasswords = lazy(() => import('../pages/Password/Create'));
const UpdatePasswords = lazy(() => import('../pages/Password/Update'));
const ListUserRole = lazy(() => import('../pages/UserRole/List'));
const AssignUserRole = lazy(() => import('../pages/UserRole/Assign'));
import ListRolesPermission from '../pages/RolePermission/ListRolePermission';
import ListSessions from '../pages/Session/ListSession';
import CreateSession from '../pages/Session/CreateSession';
import UpdateSession from '../pages/Session/UpdateSession';
import ViewSession from '../pages/Session/ViewSession';

const coreRoutes = [
    {
        path: '/user/security-questions/:userId',
        component: SecurityQuestions,
        title: 'Preguntas de Seguridad',
    },
    {
        path: '/user/devices/:userId',
        component: DevicesList,
        title: 'Dispositivos Usuario',
    },
    {
        path: '/sessions/user/:id/view/:sessionId',
        component: ViewSession,
        title: 'Ver Sesion',
    },
    {
        path: '/sessions/user/:id/update/:sessionId',
        component: UpdateSession,
        title: 'Actualizar Sesion',
    },
    {
        path: '/sessions/user/:id/create',
        component: CreateSession,
        title: 'Crear Sesion',
    },
    {
        path: '/sessions/user/:id',
        component: ListSessions,
        title: 'Listar Sesiones',
    },
    {
        path: '/user/digital-signature/:userId',
        component: DigitalSignature,
        title: 'Firma Digital',
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
        path: '/user/passwords/:userId',
        title: 'List Password',
        component: ListPasswords,
    },
    {
        path: '/user/passwords/create/:userId',
        title: 'Create Password',
        component: CreatePasswords,
    },
    {
        path: '/user/passwords/update/:id',
        title: 'Update Password',
        component: UpdatePasswords,
    },
    {
        path: '/roles/list',
        title: 'Roles List',
        component: RolesList,
    },
    {
        path: '/role/create',
        title: 'Create Role',
        component: CreateRole,
    },
    {
        path: '/role/update/:id',
        title: 'Update Role',
        component: RoleUpdate,
    },
    {
        path: '/user-role/:userId',
        title: 'User Roles',
        component: ListUserRole,
    },
    {
        path: '/user-role/assign/:userId',
        title: 'Assign Roles',
        component: AssignUserRole,
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
    },
];

const routes = [...coreRoutes];
export default routes;
