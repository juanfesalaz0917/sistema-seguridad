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
    Security as SecurityIcon,
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

    const [securityOpen, setSecurityOpen] = useState(
        pathname.includes('users') ||
            pathname.includes('roles') ||
            pathname.includes('permissions'),
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
                position: 'fixed',
                zIndex: (theme) => theme.zIndex.drawer,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    bgcolor: '#1C2434',
                    color: '#DEE4EE',
                    borderRight: 'none',
                    position: 'fixed',
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
                </List>
            </Box>
        </Drawer>
    );
};

export default SidebarMui;
