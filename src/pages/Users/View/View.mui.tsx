import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { User } from '../../../models/User';
import { userService } from '../../../services/userService';
import toast from 'react-hot-toast';
import Breadcrumb from '../../../components/Breadcrumb';
import React from 'react';
import {
    Box,
    Paper,
    Avatar,
    Typography,
    CircularProgress,
    Divider,
} from '@mui/material';

const MuiUserView: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserData();
    }, [userId]);

    const loadUserData = async () => {
        try {
            setLoading(true);
            const id = Number.parseInt(userId || '0');
            const userData = await userService.getUserById(id);
            setUser(userData);
        } catch (error) {
            toast.error('Error loading user profile');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="h6">User not found</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Breadcrumb pageName="User Profile" />

            <Paper elevation={2} sx={{ overflow: 'hidden' }}>
                <Box
                    sx={{
                        height: { xs: 180, md: 260 },
                        backgroundImage: `url('/src/images/cover/abstract-gradient.jpg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />

                <Box
                    sx={{
                        textAlign: 'center',
                        p: { xs: 2, md: 4 },
                        pt: { xs: 0, md: 0 },
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: { xs: -8, md: -10 },
                        }}
                    >
                        <Avatar
                            src={
                                user.photo_url ||
                                '/src/images/user/placeholder-user.jpg'
                            }
                            alt={user.name}
                            sx={{
                                width: { xs: 96, md: 120 },
                                height: { xs: 96, md: 120 },
                                border: '4px solid rgba(255,255,255,0.9)',
                            }}
                        />
                    </Box>

                    <Box sx={{ mt: 2 }}>
                        <Typography
                            variant="h5"
                            component="h3"
                            sx={{ fontWeight: 600 }}
                        >
                            {user.name}
                        </Typography>
                        <Typography color="text.secondary">
                            {user.email}
                        </Typography>
                    </Box>

                    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 3 }}>
                        <Paper variant="outlined" sx={{ p: 1 }}>
                            <Box
                                sx={{ display: 'flex', alignItems: 'stretch' }}
                            >
                                <Box
                                    sx={{
                                        flex: '1 1 33.333%',
                                        textAlign: 'center',
                                        py: 1,
                                    }}
                                >
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: 600 }}
                                    >
                                        ID
                                    </Typography>
                                    <Typography variant="body2">
                                        {user.id}
                                    </Typography>
                                </Box>

                                <Divider orientation="vertical" flexItem />

                                <Box
                                    sx={{
                                        flex: '1 1 33.333%',
                                        textAlign: 'center',
                                        py: 1,
                                    }}
                                >
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: 600 }}
                                    >
                                        Status
                                    </Typography>
                                    <Typography variant="body2">
                                        Active
                                    </Typography>
                                </Box>

                                <Divider orientation="vertical" flexItem />

                                <Box
                                    sx={{
                                        flex: '1 1 33.333%',
                                        textAlign: 'center',
                                        py: 1,
                                    }}
                                >
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: 600 }}
                                    >
                                        Verified
                                    </Typography>
                                    <Typography variant="body2">Yes</Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default MuiUserView;
