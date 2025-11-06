import { Link } from 'react-router-dom';
import Logo from '../../images/logo/logo.svg';
import DarkModeSwitcher from '../DarkModeSwitcher';
import DropdownMessage from '../DropdownMessage';
import DropdownNotification from '../DropdownNotification';
import DropdownUser from '../DropdownUser';
import UiLibrarySwitcher from '../UiLibrarySwitcher';
import {
    AppBar,
    Box,
    IconButton,
    InputBase,
    Toolbar,
    useTheme,
    alpha,
    styled,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

// Styled components
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor:
        theme.palette.mode === 'dark'
            ? alpha(theme.palette.common.white, 0.05)
            : alpha(theme.palette.common.black, 0.04),
    '&:hover': {
        backgroundColor:
            theme.palette.mode === 'dark'
                ? alpha(theme.palette.common.white, 0.1)
                : alpha(theme.palette.common.black, 0.07),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: theme.palette.text.primary,
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        fontSize: '0.875rem',
        height: '38px',
        transition: theme.transitions.create(['width', 'background-color']),
        width: '100%',
    },
}));

const Header = (props: {
    sidebarOpen: string | boolean | undefined;
    setSidebarOpen: (arg0: boolean) => void;
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: theme.zIndex.drawer + 1,
                bgcolor: isDark ? 'background.paper' : '#ffffff',
                color: isDark ? 'text.primary' : 'text.primary',
                borderBottom: 1,
                borderColor: 'divider',
                boxShadow: 'none',
            }}
        >
            <Toolbar
                sx={{
                    justifyContent: 'space-between',
                    px: { xs: 2, md: 3, xl: 5.5 },
                    minHeight: { xs: 64, sm: 70 },
                }}
            >
                {/* Left section - Mobile menu & Logo */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 1, sm: 2 },
                    }}
                >
                    <IconButton
                        size="small"
                        aria-label="open drawer"
                        edge="start"
                        onClick={(e) => {
                            e.stopPropagation();
                            props.setSidebarOpen(!props.sidebarOpen);
                        }}
                        sx={{
                            display: { lg: 'none' },
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 1,
                            p: 1,
                            mr: 2,
                            color: 'text.primary',
                            bgcolor:
                                theme.palette.mode === 'dark'
                                    ? 'background.paper'
                                    : 'background.default',
                            '&:hover': {
                                bgcolor:
                                    theme.palette.mode === 'dark'
                                        ? alpha(theme.palette.common.white, 0.1)
                                        : alpha(
                                              theme.palette.common.black,
                                              0.04,
                                          ),
                            },
                        }}
                    >
                        <MenuIcon fontSize="small" />
                    </IconButton>

                    <Box
                        component={Link}
                        to="/"
                        sx={{
                            display: { xs: 'block', lg: 'none' },
                            flexShrink: 0,
                            '& img': { height: 32 },
                        }}
                    >
                        <img src={Logo} alt="Logo" />
                    </Box>
                </Box>

                {/* Search bar */}
                <Box
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        flexGrow: 1,
                        mx: 4,
                    }}
                >
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Buscar..."
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                </Box>

                {/* Right section - Actions */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 1.5, '2xsm': 3.5 },
                    }}
                >
                    <Box
                        component="ul"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: { xs: 1, '2xsm': 2 },
                            p: 0,
                            m: 0,
                            listStyle: 'none',
                        }}
                    >
                        <DarkModeSwitcher />
                        <DropdownNotification />
                        <DropdownMessage />
                    </Box>

                    <UiLibrarySwitcher />
                    <DropdownUser />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
