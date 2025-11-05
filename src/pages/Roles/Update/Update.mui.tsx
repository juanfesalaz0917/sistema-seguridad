import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { roleService } from '../../../services/roleService';
import type { Role } from '../../../models/Role';
import Breadcrumb from '../../../components/Breadcrumb';
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

const UpdateRole: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [role, setRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        loadRole(Number.parseInt(id));
    }, [id]);

    const loadRole = async (roleId: number) => {
        try {
            const data = await roleService.getRoleById(roleId);
            setRole(data);
        } catch (error) {
            console.error('Error loading role:', error);
            toast.error('Failed to load role');
        } finally {
            setLoading(false);
        }
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        description: Yup.string(),
    });

    const handleSubmit = async (values: Role) => {
        if (!role?.id) return;

        try {
            const result = await roleService.updateRole(role.id, values);
            if (result) {
                toast.success('Role updated successfully!');
                navigate(-1);
            } else {
                toast.error('Failed to update role');
            }
        } catch (error) {
            console.error('Error updating role:', error);
            toast.error('An error occurred while updating the role');
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

    if (!role) {
        return (
            <>
                <Breadcrumb pageName="Update Role" />
                <Paper sx={{ p: 3, borderRadius: 1, boxShadow: 1 }}>
                    <Typography align="center" color="text.secondary">
                        Role not found.
                    </Typography>
                </Paper>
            </>
        );
    }

    return (
        <>
            <Breadcrumb pageName="Update Role" />
            <Paper sx={{ borderRadius: 1, boxShadow: 1 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        Edit Role
                    </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                    <Formik
                        initialValues={{
                            id: role.id,
                            name: role.name || '',
                            description: role.description || '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
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
                                            name="name"
                                            label="Name *"
                                            placeholder="Enter role name"
                                            variant="outlined"
                                            error={Boolean(
                                                touched.name && errors.name,
                                            )}
                                            helperText={
                                                touched.name && errors.name
                                                    ? String(errors.name)
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
                                            name="description"
                                            label="Description"
                                            placeholder="Enter description"
                                            variant="outlined"
                                            multiline
                                            rows={3}
                                            error={Boolean(
                                                touched.description &&
                                                    errors.description,
                                            )}
                                            helperText={
                                                touched.description &&
                                                errors.description
                                                    ? String(errors.description)
                                                    : ''
                                            }
                                        />
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <GenericButton type="submit">
                                        Update Role
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

export default UpdateRole;
