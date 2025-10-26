import { List } from 'lucide-react';
import { lazy } from 'react';
import UpdateUser from '../pages/Users/Update';

const Calendar = lazy(() => import('../pages/Calendar'));
const CreateUser = lazy(() => import('../pages/Users/Create'));
const Chart = lazy(() => import('../pages/Chart'));
const FormElements = lazy(() => import('../pages/Form/FormElements'));
const FormLayout = lazy(() => import('../pages/Form/FormLayout'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Tables = lazy(() => import('../pages/Tables'));
const Alerts = lazy(() => import('../pages/UiElements/Alerts'));
const Buttons = lazy(() => import('../pages/UiElements/Buttons'));
const Demo= lazy(() => import('../pages/Demo'));
const ListUsers= lazy(() => import('../pages/Users/ListUsers'));
const RolesList= lazy(() => import('../pages/Roles/RolesList'));

const coreRoutes = [
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
    path: '/profile',
    title: 'Profile',
    component: Profile,
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
];

const routes = [...coreRoutes];
export default routes;
