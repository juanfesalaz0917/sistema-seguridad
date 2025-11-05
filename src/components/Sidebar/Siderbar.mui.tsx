import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Logo from '../../images/logo/logo.svg';

import {
    Drawer,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    IconButton,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    CalendarMonth as CalendarIcon,
    Person as PersonIcon,
    Security as SecurityIcon,
    Description as FormIcon,
    TableChart as TableIcon,
    Settings as SettingsIcon,
    BarChart as ChartIcon,
    Widgets as WidgetsIcon,
    Login as AuthIcon,
    ExpandLess,
    ExpandMore,
    ChevronLeft,
} from '@mui/icons-material';

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
}

const SidebarMui: React.FC<SidebarProps> = ({
    sidebarOpen,
    setSidebarOpen,
}) => {
    const user = useSelector((state: RootState) => state.user.user);
    const location = useLocation();
    const { pathname } = location;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

    const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
    const [sidebarExpanded, setSidebarExpanded] = useState(
        storedSidebarExpanded === null
            ? false
            : storedSidebarExpanded === 'true',
    );

    const [dashboardOpen, setDashboardOpen] = useState(
        pathname === '/' || pathname.includes('dashboard'),
    );
    const [securityOpen, setSecurityOpen] = useState(
        pathname.includes('users') ||
            pathname.includes('roles') ||
            pathname.includes('permissions'),
    );
    const [formsOpen, setFormsOpen] = useState(
        pathname === '/forms' || pathname.includes('forms'),
    );
    const [uiOpen, setUiOpen] = useState(
        pathname === '/ui' || pathname.includes('ui'),
    );
    const [authOpen, setAuthOpen] = useState(
        pathname === '/auth' || pathname.includes('auth'),
    );

    useEffect(() => {
        localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
        if (sidebarExpanded) {
            document.querySelector('body')?.classList.add('sidebar-expanded');
        } else {
            document
                .querySelector('body')
                ?.classList.remove('sidebar-expanded');
        }
    }, [sidebarExpanded]);

    const handleDrawerClose = () => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    const drawerWidth = 290;

    const isActiveRoute = (route: string) => {
        return pathname === route || pathname.includes(route);
    };

    if (!user) {
        return null;
    }

    return (
        <Drawer
            variant={isMobile ? 'temporary' : 'permanent'}
            open={sidebarOpen}
            onClose={handleDrawerClose}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    bgcolor: '#1C2434',
                    color: '#DEE4EE',
                    borderRight: 'none',
                },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2.5,
                    borderBottom: '1px solid #313D4A',
                }}
            >
                <NavLink
                    to="/"
                    style={{ display: 'flex', alignItems: 'center' }}
                >
                    <img src={Logo} alt="Logo" style={{ height: 40 }} />
                </NavLink>

                {isMobile && (
                    <IconButton
                        onClick={() => setSidebarOpen(false)}
                        sx={{ color: '#DEE4EE' }}
                    >
                        <ChevronLeft />
                    </IconButton>
                )}
            </Box>

            {/* Menu */}
            <Box
                sx={{
                    overflowY: 'auto',
                    flex: 1,
                    px: 2,
                    py: 3,
                    '&::-webkit-scrollbar': {
                        display: 'block !important',
                        width: '12px',
                    },
                    scrollbarWidth: 'auto',
                }}
            >
                {/* MENU Group */}
                <Typography
                    variant="caption"
                    sx={{
                        display: 'block',
                        px: 2,
                        mb: 2,
                        color: '#8A99AF',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                    }}
                >
                    MENU
                </Typography>

                <List sx={{ mb: 3 }}>
                    {/* Dashboard with Dropdown */}
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => {
                                if (sidebarExpanded) {
                                    setDashboardOpen(!dashboardOpen);
                                } else {
                                    setSidebarExpanded(true);
                                    setDashboardOpen(true);
                                }
                            }}
                            sx={{
                                borderRadius: 1,
                                mb: 0.5,
                                bgcolor:
                                    isActiveRoute('dashboard') ||
                                    pathname === '/'
                                        ? '#313D4A'
                                        : 'transparent',
                                '&:hover': { bgcolor: '#313D4A' },
                                color: '#DEE4EE',
                            }}
                        >
                            <ListItemIcon
                                sx={{ color: '#DEE4EE', minWidth: 40 }}
                            >
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                            {dashboardOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={dashboardOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem disablePadding>
                                <ListItemButton
                                    component={NavLink}
                                    to="/"
                                    sx={{
                                        pl: 6,
                                        borderRadius: 1,
                                        color:
                                            pathname === '/'
                                                ? '#ffffff'
                                                : '#8A99AF',
                                        '&:hover': { color: '#ffffff' },
                                    }}
                                    onClick={handleDrawerClose}
                                >
                                    <ListItemText primary="eCommerce" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Collapse>

                    {/* Calendar */}
                    <ListItem disablePadding>
                        <ListItemButton
                            component={NavLink}
                            to="/calendar"
                            sx={{
                                borderRadius: 1,
                                mb: 0.5,
                                bgcolor: pathname.includes('calendar')
                                    ? '#313D4A'
                                    : 'transparent',
                                '&:hover': { bgcolor: '#313D4A' },
                                color: '#DEE4EE',
                            }}
                            onClick={handleDrawerClose}
                        >
                            <ListItemIcon
                                sx={{ color: '#DEE4EE', minWidth: 40 }}
                            >
                                <CalendarIcon />
                            </ListItemIcon>
                            <ListItemText primary="Calendar" />
                        </ListItemButton>
                    </ListItem>

                    {/* Profile */}
                    <ListItem disablePadding>
                        <ListItemButton
                            component={NavLink}
                            to="/profile"
                            sx={{
                                borderRadius: 1,
                                mb: 0.5,
                                bgcolor: pathname.includes('profile')
                                    ? '#313D4A'
                                    : 'transparent',
                                '&:hover': { bgcolor: '#313D4A' },
                                color: '#DEE4EE',
                            }}
                            onClick={handleDrawerClose}
                        >
                            <ListItemIcon
                                sx={{ color: '#DEE4EE', minWidth: 40 }}
                            >
                                <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary="Profile" />
                        </ListItemButton>
                    </ListItem>

                    {/* Security with Dropdown */}
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => {
                                if (sidebarExpanded) {
                                    setSecurityOpen(!securityOpen);
                                } else {
                                    setSidebarExpanded(true);
                                    setSecurityOpen(true);
                                }
                            }}
                            sx={{
                                borderRadius: 1,
                                mb: 0.5,
                                bgcolor:
                                    pathname.includes('user') ||
                                    pathname.includes('roles') ||
                                    pathname.includes('permission')
                                        ? '#313D4A'
                                        : 'transparent',
                                '&:hover': { bgcolor: '#313D4A' },
                                color: '#DEE4EE',
                            }}
                        >
                            <ListItemIcon
                                sx={{ color: '#DEE4EE', minWidth: 40 }}
                            >
                                <SecurityIcon />
                            </ListItemIcon>
                            <ListItemText primary="Security" />
                            {securityOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={securityOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem disablePadding>
                                <ListItemButton
                                    component={NavLink}
                                    to="/user/list"
                                    sx={{
                                        pl: 6,
                                        borderRadius: 1,
                                        color: pathname.includes('user/list')
                                            ? '#ffffff'
                                            : '#8A99AF',
                                        '&:hover': { color: '#ffffff' },
                                    }}
                                    onClick={handleDrawerClose}
                                >
                                    <ListItemText primary="Users" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton
                                    component={NavLink}
                                    to="/roles/list"
                                    sx={{
                                        pl: 6,
                                        borderRadius: 1,
                                        color: pathname.includes('roles/list')
                                            ? '#ffffff'
                                            : '#8A99AF',
                                        '&:hover': { color: '#ffffff' },
                                    }}
                                    onClick={handleDrawerClose}
                                >
                                    <ListItemText primary="Roles" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton
                                    component={NavLink}
                                    to="/permissions/list"
                                    sx={{
                                        pl: 6,
                                        borderRadius: 1,
                                        color: pathname.includes(
                                            'permission/list',
                                        )
                                            ? '#ffffff'
                                            : '#8A99AF',
                                        '&:hover': { color: '#ffffff' },
                                    }}
                                    onClick={handleDrawerClose}
                                >
                                    <ListItemText primary="Permissions" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Collapse>

                    {/* Forms with Dropdown */}
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => {
                                if (sidebarExpanded) {
                                    setFormsOpen(!formsOpen);
                                } else {
                                    setSidebarExpanded(true);
                                    setFormsOpen(true);
                                }
                            }}
                            sx={{
                                borderRadius: 1,
                                mb: 0.5,
                                bgcolor: pathname.includes('forms')
                                    ? '#313D4A'
                                    : 'transparent',
                                '&:hover': { bgcolor: '#313D4A' },
                                color: '#DEE4EE',
                            }}
                        >
                            <ListItemIcon
                                sx={{ color: '#DEE4EE', minWidth: 40 }}
                            >
                                <FormIcon />
                            </ListItemIcon>
                            <ListItemText primary="Forms" />
                            {formsOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={formsOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem disablePadding>
                                <ListItemButton
                                    component={NavLink}
                                    to="/forms/form-elements"
                                    sx={{
                                        pl: 6,
                                        borderRadius: 1,
                                        color: pathname.includes(
                                            'form-elements',
                                        )
                                            ? '#ffffff'
                                            : '#8A99AF',
                                        '&:hover': { color: '#ffffff' },
                                    }}
                                    onClick={handleDrawerClose}
                                >
                                    <ListItemText primary="Form Elements" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton
                                    component={NavLink}
                                    to="/forms/form-layout"
                                    sx={{
                                        pl: 6,
                                        borderRadius: 1,
                                        color: pathname.includes('form-layout')
                                            ? '#ffffff'
                                            : '#8A99AF',
                                        '&:hover': { color: '#ffffff' },
                                    }}
                                    onClick={handleDrawerClose}
                                >
                                    <ListItemText primary="Form Layout" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Collapse>

                    {/* Tables */}
                    <ListItem disablePadding>
                        <ListItemButton
                            component={NavLink}
                            to="/tables"
                            sx={{
                                borderRadius: 1,
                                mb: 0.5,
                                bgcolor: pathname.includes('tables')
                                    ? '#313D4A'
                                    : 'transparent',
                                '&:hover': { bgcolor: '#313D4A' },
                                color: '#DEE4EE',
                            }}
                            onClick={handleDrawerClose}
                        >
                            <ListItemIcon
                                sx={{ color: '#DEE4EE', minWidth: 40 }}
                            >
                                <TableIcon />
                            </ListItemIcon>
                            <ListItemText primary="Tables" />
                        </ListItemButton>
                    </ListItem>

                    {/* Settings */}
                    <ListItem disablePadding>
                        <ListItemButton
                            component={NavLink}
                            to="/settings"
                            sx={{
                                borderRadius: 1,
                                mb: 0.5,
                                bgcolor: pathname.includes('settings')
                                    ? '#313D4A'
                                    : 'transparent',
                                '&:hover': { bgcolor: '#313D4A' },
                                color: '#DEE4EE',
                            }}
                            onClick={handleDrawerClose}
                        >
                            <ListItemIcon
                                sx={{ color: '#DEE4EE', minWidth: 40 }}
                            >
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Settings" />
                        </ListItemButton>
                    </ListItem>
                </List>

                {/* OTHERS Group */}
                <Typography
                    variant="caption"
                    sx={{
                        display: 'block',
                        px: 2,
                        mb: 2,
                        mt: 3,
                        color: '#8A99AF',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                    }}
                >
                    OTHERS
                </Typography>

                <List>
                    {/* Chart */}
                    <ListItem disablePadding>
                        <ListItemButton
                            component={NavLink}
                            to="/chart"
                            sx={{
                                borderRadius: 1,
                                mb: 0.5,
                                bgcolor: pathname.includes('chart')
                                    ? '#313D4A'
                                    : 'transparent',
                                '&:hover': { bgcolor: '#313D4A' },
                                color: '#DEE4EE',
                            }}
                            onClick={handleDrawerClose}
                        >
                            <ListItemIcon
                                sx={{ color: '#DEE4EE', minWidth: 40 }}
                            >
                                <ChartIcon />
                            </ListItemIcon>
                            <ListItemText primary="Chart" />
                        </ListItemButton>
                    </ListItem>

                    {/* UI Elements with Dropdown */}
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => {
                                if (sidebarExpanded) {
                                    setUiOpen(!uiOpen);
                                } else {
                                    setSidebarExpanded(true);
                                    setUiOpen(true);
                                }
                            }}
                            sx={{
                                borderRadius: 1,
                                mb: 0.5,
                                bgcolor: pathname.includes('ui')
                                    ? '#313D4A'
                                    : 'transparent',
                                '&:hover': { bgcolor: '#313D4A' },
                                color: '#DEE4EE',
                            }}
                        >
                            <ListItemIcon
                                sx={{ color: '#DEE4EE', minWidth: 40 }}
                            >
                                <WidgetsIcon />
                            </ListItemIcon>
                            <ListItemText primary="UI Elements" />
                            {uiOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={uiOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem disablePadding>
                                <ListItemButton
                                    component={NavLink}
                                    to="/ui/alerts"
                                    sx={{
                                        pl: 6,
                                        borderRadius: 1,
                                        color: pathname.includes('alerts')
                                            ? '#ffffff'
                                            : '#8A99AF',
                                        '&:hover': { color: '#ffffff' },
                                    }}
                                    onClick={handleDrawerClose}
                                >
                                    <ListItemText primary="Alerts" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton
                                    component={NavLink}
                                    to="/ui/buttons"
                                    sx={{
                                        pl: 6,
                                        borderRadius: 1,
                                        color: pathname.includes('buttons')
                                            ? '#ffffff'
                                            : '#8A99AF',
                                        '&:hover': { color: '#ffffff' },
                                    }}
                                    onClick={handleDrawerClose}
                                >
                                    <ListItemText primary="Buttons" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Collapse>

                    {/* Authentication with Dropdown */}
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => {
                                if (sidebarExpanded) {
                                    setAuthOpen(!authOpen);
                                } else {
                                    setSidebarExpanded(true);
                                    setAuthOpen(true);
                                }
                            }}
                            sx={{
                                borderRadius: 1,
                                mb: 0.5,
                                bgcolor: pathname.includes('auth')
                                    ? '#313D4A'
                                    : 'transparent',
                                '&:hover': { bgcolor: '#313D4A' },
                                color: '#DEE4EE',
                            }}
                        >
                            <ListItemIcon
                                sx={{ color: '#DEE4EE', minWidth: 40 }}
                            >
                                <AuthIcon />
                            </ListItemIcon>
                            <ListItemText primary="Authentication" />
                            {authOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={authOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem disablePadding>
                                <ListItemButton
                                    component={NavLink}
                                    to="/auth/signin"
                                    sx={{
                                        pl: 6,
                                        borderRadius: 1,
                                        color: pathname.includes('signin')
                                            ? '#ffffff'
                                            : '#8A99AF',
                                        '&:hover': { color: '#ffffff' },
                                    }}
                                    onClick={handleDrawerClose}
                                >
                                    <ListItemText primary="Sign In" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton
                                    component={NavLink}
                                    to="/auth/signup"
                                    sx={{
                                        pl: 6,
                                        borderRadius: 1,
                                        color: pathname.includes('signup')
                                            ? '#ffffff'
                                            : '#8A99AF',
                                        '&:hover': { color: '#ffffff' },
                                    }}
                                    onClick={handleDrawerClose}
                                >
                                    <ListItemText primary="Sign Up" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Collapse>
                </List>
            </Box>
        </Drawer>
    );
};

export default SidebarMui;
