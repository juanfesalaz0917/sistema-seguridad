import type React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { addressService } from '../../../services/addressService';
import type { Address } from '../../../models/Address';
import Breadcrumb from '../../../components/Breadcrumb';
import MapPicker from '../../../components/MapPicker';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import {
    Box,
    Paper,
    Typography,
    TextField,
    CircularProgress,
} from '@mui/material';
import GenericButton from '../../../components/GenericButton';

const UpdateAddress: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [address, setAddress] = useState<Address | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAddress(Number.parseInt(userId || ''));
    }, [userId]);

    const loadAddress = async (userId: number) => {
        try {
            const data = await addressService.getAddressesByUserId(userId);
            setAddress(data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading address:', error);
            toast.error('Failed to load address');
        } finally {
            setLoading(false);
        }
    };

    const validationSchema = Yup.object({
        street: Yup.string().required('Street is required'),
        number: Yup.string().required('Number is required'),
        latitude: Yup.number().required('Latitude is required'),
        longitude: Yup.number().required('Longitude is required'),
    });

    const handleSubmit = async (values: Address) => {
        if (!address?.id) return;

        try {
            const result = await addressService.updateAddress(
                address.id,
                values,
            );
            if (result) {
                toast.success('Address updated successfully!');
                navigate(-1);
            } else {
                toast.error('Failed to update address');
            }
        } catch (error) {
            console.error('Error updating address:', error);
            toast.error('An error occurred while updating the address');
        }
    };

    const handleDelete = async () => {
        if (!address?.id) return;

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            const success = await addressService.deleteAddress(address.id);
            if (success) {
                Swal.fire('Deleted!', 'Address has been deleted.', 'success');
                navigate(-1);
            } else {
                Swal.fire('Error!', 'Failed to delete address.', 'error');
            }
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                <Breadcrumb pageName="Update Address" />
                <Paper sx={{ p: 3, borderRadius: 1, boxShadow: 1 }}>
                    <Typography align="center" color="text.secondary">
                        Address not found.
                    </Typography>
                </Paper>
            </>
        );
    }

    return (
        <>
            <Breadcrumb pageName="Update Address" />
            <Paper sx={{ borderRadius: 1, boxShadow: 1 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        Edit Address
                    </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                    <Formik
                        initialValues={{
                            id: address.id,
                            user_id: address.user_id,
                            street: address.street,
                            number: address.number,
                            latitude: address.latitude,
                            longitude: address.longitude,
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, setFieldValue, errors, touched }) => (
                            <Form>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 3,
                                        mb: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            flexBasis: {
                                                xs: '100%',
                                                sm: '45%',
                                            },
                                        }}
                                    >
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="street"
                                            label="Street *"
                                            placeholder="Enter street name"
                                            variant="outlined"
                                            error={Boolean(
                                                touched.street && errors.street,
                                            )}
                                            helperText={
                                                touched.street && errors.street
                                                    ? String(errors.street)
                                                    : ''
                                            }
                                        />
                                    </Box>

                                    <Box
                                        sx={{
                                            flexBasis: {
                                                xs: '100%',
                                                sm: '45%',
                                            },
                                        }}
                                    >
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="number"
                                            label="Number *"
                                            placeholder="Enter number"
                                            variant="outlined"
                                            error={Boolean(
                                                touched.number && errors.number,
                                            )}
                                            helperText={
                                                touched.number && errors.number
                                                    ? String(errors.number)
                                                    : ''
                                            }
                                        />
                                    </Box>

                                    <Box
                                        sx={{
                                            flexBasis: {
                                                xs: '100%',
                                                sm: '45%',
                                            },
                                        }}
                                    >
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="latitude"
                                            label="Latitude *"
                                            type="number"
                                            inputProps={{ step: 'any' }}
                                            variant="outlined"
                                            InputProps={{ readOnly: true }}
                                            error={Boolean(
                                                touched.latitude &&
                                                    errors.latitude,
                                            )}
                                            helperText={
                                                touched.latitude &&
                                                errors.latitude
                                                    ? String(errors.latitude)
                                                    : ''
                                            }
                                        />
                                    </Box>

                                    <Box
                                        sx={{
                                            flexBasis: {
                                                xs: '100%',
                                                sm: '45%',
                                            },
                                        }}
                                    >
                                        <Field
                                            as={TextField}
                                            fullWidth
                                            name="longitude"
                                            label="Longitude *"
                                            type="number"
                                            inputProps={{ step: 'any' }}
                                            variant="outlined"
                                            InputProps={{ readOnly: true }}
                                            error={Boolean(
                                                touched.longitude &&
                                                    errors.longitude,
                                            )}
                                            helperText={
                                                touched.longitude &&
                                                errors.longitude
                                                    ? String(errors.longitude)
                                                    : ''
                                            }
                                        />
                                    </Box>
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ mb: 1, fontWeight: 500 }}
                                    >
                                        Select Location on Map *
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 1 }}
                                    >
                                        Click on the map to update the location
                                    </Typography>
                                    <MapPicker
                                        latitude={values.latitude}
                                        longitude={values.longitude}
                                        onLocationChange={(lat, lng) => {
                                            setFieldValue('latitude', lat);
                                            setFieldValue('longitude', lng);
                                        }}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <GenericButton type="submit">
                                        Update Address
                                    </GenericButton>
                                    <GenericButton onClick={handleDelete}>
                                        Delete Address
                                    </GenericButton>
                                    <GenericButton onClick={() => navigate(-1)}>
                                        Cancel
                                    </GenericButton>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Paper>
        </>
    );
};

export default UpdateAddress;
