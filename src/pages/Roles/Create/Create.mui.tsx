import type React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Role } from '../../../models/Role';
import toast from 'react-hot-toast';
import Breadcrumb from '../../../components/Breadcrumb';
import GenericButton from '../../../components/GenericButton';
import { Box, Paper, Typography, TextField } from '@mui/material';
import * as Yup from 'yup';
import { roleService } from '../../../services/roleService';
import { Formik, Form, Field } from 'formik';

const RoleCreate: React.FC = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        description: Yup.string().required('Description is required'),
    });

    const handleSubmit = async (values: Role) => {
        try {
            const result = await roleService.createRole(values);
            if (result) {
                toast.success('Role created successfully!');
                navigate(`/roles/list`);
            } else {
                toast.error('Failed to create role');
            }
        } catch (error) {
            console.error('Error creating Role', error);
            toast.error('An error occurred while creating the role');
        }
    };

    return (
        <>
            <Breadcrumb pageName="Create Role" />
            <Paper sx={{ borderRadius: 1, boxShadow: 1 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        New Role
                    </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                    <Formik
                        initialValues={{
                            id: 0,
                            name: '',
                            description: '',
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
                                            name="name"
                                            label="name *"
                                            placeholder="Enter the name"
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
                                            label="description *"
                                            placeholder="Enter description"
                                            variant="outlined"
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
                                        Create Role
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

export default RoleCreate;
