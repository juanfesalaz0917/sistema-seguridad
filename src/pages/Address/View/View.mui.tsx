import type React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addressService } from '../../../services/addressService';
import type { Address } from '../../../models/Address';
import toast from 'react-hot-toast';
import Breadcrumb from '../../../components/Breadcrumb';
import MapPicker from '../../../components/MapPicker';
import GenericButton from '../../../components/GenericButton';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';

const AddressView: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [address, setAddress] = useState<Address | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            loadAddress(Number.parseInt(userId));
        }
    }, [userId]);

    const loadAddress = async (id: number) => {
        try {
            const data = await addressService.getAddressesByUserId(id);
            setAddress(data);
        } catch (error) {
            console.error('Error loading address:', error);
            toast.error('Failed to load address');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!address) {
        return (
            <>
                <Breadcrumb pageName="User Address" />
                <Paper
                    sx={{
                        p: 3,
                        borderRadius: 1,
                        boxShadow: 1,
                    }}
                >
                    <Typography
                        align="center"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        No address found for this user.
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 2,
                        }}
                    >
                        <GenericButton
                            onClick={() =>
                                navigate(`/user/address/create/${userId}`)
                            }
                        >
                            Create Address
                        </GenericButton>
                    </Box>
                </Paper>
            </>
        );
    }

    return (
        <>
            <Breadcrumb pageName="User Address" />
            <Paper sx={{ borderRadius: 1, boxShadow: 1 }}>
                <Box
                    sx={{
                        p: 2,
                        borderBottom: 1,
                        borderColor: 'divider',
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        Address Details
                    </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 3,
                            mb: 3,
                        }}
                    >
                        <Box sx={{ flexBasis: { xs: '100%', sm: '45%' } }}>
                            <Typography
                                variant="subtitle2"
                                sx={{ mb: 1, fontWeight: 500 }}
                            >
                                Street
                            </Typography>
                            <Typography color="text.secondary">
                                {address.street}
                            </Typography>
                        </Box>
                        <Box sx={{ flexBasis: { xs: '100%', sm: '45%' } }}>
                            <Typography
                                variant="subtitle2"
                                sx={{ mb: 1, fontWeight: 500 }}
                            >
                                Number
                            </Typography>
                            <Typography color="text.secondary">
                                {address.number}
                            </Typography>
                        </Box>
                        <Box sx={{ flexBasis: { xs: '100%', sm: '45%' } }}>
                            <Typography
                                variant="subtitle2"
                                sx={{ mb: 1, fontWeight: 500 }}
                            >
                                Latitude
                            </Typography>
                            <Typography color="text.secondary">
                                {address.latitude}
                            </Typography>
                        </Box>
                        <Box sx={{ flexBasis: { xs: '100%', sm: '45%' } }}>
                            <Typography
                                variant="subtitle2"
                                sx={{ mb: 1, fontWeight: 500 }}
                            >
                                Longitude
                            </Typography>
                            <Typography color="text.secondary">
                                {address.longitude}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="subtitle2"
                            sx={{ mb: 1, fontWeight: 500 }}
                        >
                            Location on Map
                        </Typography>
                        <MapPicker
                            latitude={address.latitude}
                            longitude={address.longitude}
                            onLocationChange={() => {}}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <GenericButton
                            onClick={() =>
                                navigate(`/user/address/update/${address.id}`)
                            }
                        >
                            Edit Address
                        </GenericButton>
                        <GenericButton onClick={() => navigate(-1)}>
                            Back
                        </GenericButton>
                    </Box>
                </Box>
            </Paper>
        </>
    );
};

export default AddressView;
