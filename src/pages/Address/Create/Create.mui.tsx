import type React from 'react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Address } from '../../../models/Address';
import toast from 'react-hot-toast';
import Breadcrumb from '../../../components/Breadcrumb';
import MapPicker from '../../../components/MapPicker';
import GenericButton from '../../../components/GenericButton';
import { Box, Paper, Typography, TextField } from '@mui/material';
import * as Yup from 'yup';
import { addressService } from '../../../services/addressService';
import { Formik, Form, Field } from 'formik';

const AddressCreate: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [mapPosition, setMapPosition] = useState({
        lat: 4.6097,
        lng: -74.0817,
    }); // Bogotá default

    const validationSchema = Yup.object({
        street: Yup.string().required('Street is required'),
        number: Yup.string().required('Number is required'),
        latitude: Yup.number().required('Latitude is required'),
        longitude: Yup.number().required('Longitude is required'),
    });

    const handleSubmit = async (values: Address) => {
        if (!userId) {
            toast.error('User ID is required');
            return;
        }

        try {
            const result = await addressService.createAddress(
                Number.parseInt(userId),
                values,
            );
            if (result) {
                toast.success('Address created successfully!');
                navigate(`/user/address/${userId}`);
            } else {
                toast.error('Failed to create address');
            }
        } catch (error) {
            console.error('Error creating address:', error);
            toast.error('An error occurred while creating the address');
        }
    };

    return (
        <>
            <Breadcrumb pageName="Create Address" />
            <Paper sx={{ borderRadius: 1, boxShadow: 1 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        New Address
                    </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                    <Formik
                        initialValues={{
                            id: 0,
                            user_id: Number.parseInt(userId || '0'),
                            street: '',
                            number: '',
                            latitude: mapPosition.lat,
                            longitude: mapPosition.lng,
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
                                        Click on the map to set the location
                                    </Typography>
                                    <MapPicker
                                        latitude={values.latitude}
                                        longitude={values.longitude}
                                        onLocationChange={(lat, lng) => {
                                            setFieldValue('latitude', lat);
                                            setFieldValue('longitude', lng);
                                            setMapPosition({ lat, lng });
                                        }}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <GenericButton type="submit">
                                        Create Address
                                    </GenericButton>
                                    <GenericButton
                                        type="button"
                                        onClick={() => navigate(-1)}
                                    >
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

export default AddressCreate;
