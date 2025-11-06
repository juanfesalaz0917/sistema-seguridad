import type React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { userRoleService } from '../../../services/userRoleService';
import { roleService } from '../../../services/roleService';
import type { Role } from '../../../models/Role';
import Breadcrumb from '../../../components/Breadcrumb';
import GenericButton from '../../../components/GenericButton';
import toast from 'react-hot-toast';
import {
    Box,
    Paper,
    Typography,
    TextField,
    MenuItem,
    CircularProgress,
    Alert,
} from '@mui/material';

const AssignRole: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log(userId);
        loadRoles();
    }, []);

    const loadRoles = async () => {
        try {
            setLoading(true);
            const data = await roleService.getRoles();
            setRoles(data ?? []);
            setError(null);
        } catch (error) {
            console.error('Error loading roles:', error);
            setError('No se pudieron cargar los roles');
            toast.error('Failed to load roles');
        } finally {
            setLoading(false);
        }
    };

    const validationSchema = Yup.object({
        role_id: Yup.number()
            .required('El rol es requerido')
            .min(1, 'Debe seleccionar un rol'),
        startAt: Yup.date().required('La fecha de inicio es requerida'),
        endAt: Yup.date()
            .nullable()
            .min(
                Yup.ref('startAt'),
                'La fecha de fin debe ser posterior a la fecha de inicio',
            ),
    });

    const formatDateForBackend = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleSubmit = async (values: {
        role_id: number;
        startAt: Date;
        endAt: Date | null;
    }) => {
        if (!userId) {
            toast.error('Se requiere el ID de usuario');
            return;
        }

        try {
            const userRoleData: any = {
                startAt: formatDateForBackend(values.startAt),
                endAt: values.endAt ? formatDateForBackend(values.endAt) : null,
            };

            const result = await userRoleService.createUserRole(
                Number.parseInt(userId),
                values.role_id,
                userRoleData,
            );

            if (result) {
                toast.success('¡Rol asignado exitosamente!');
                navigate(`/user-role/${userId}`);
            } else {
                toast.error('No se pudo asignar el rol');
            }
        } catch (error) {
            console.error('Error assigning role:', error);
            toast.error('Ocurrió un error al asignar el rol');
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '400px',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Breadcrumb pageName="Asignar Rol" />
            <Paper sx={{ borderRadius: 1, boxShadow: 1 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        Asignar Rol a Usuario #{userId}
                    </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <Formik
                        initialValues={{
                            role_id: 0,
                            startAt: new Date(),
                            endAt: null as Date | null,
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
                                            },
                                        }}
                                    >
                                        <Field
                                            as={TextField}
                                            select
                                            fullWidth
                                            name="role_id"
                                            label="Seleccionar Rol *"
                                            variant="outlined"
                                            value={values.role_id}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                setFieldValue(
                                                    'role_id',
                                                    Number(e.target.value),
                                                )
                                            }
                                            error={Boolean(
                                                touched.role_id &&
                                                    errors.role_id,
                                            )}
                                            helperText={
                                                touched.role_id &&
                                                errors.role_id
                                                    ? String(errors.role_id)
                                                    : ''
                                            }
                                        >
                                            <MenuItem value={0}>
                                                Seleccione un rol
                                            </MenuItem>
                                            {roles.map((role) => (
                                                <MenuItem
                                                    key={role.id}
                                                    value={role.id}
                                                >
                                                    {role.name} -{' '}
                                                    {role.description}
                                                </MenuItem>
                                            ))}
                                        </Field>
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
                                            name="startAt"
                                            label="Fecha de Inicio *"
                                            type="date"
                                            variant="outlined"
                                            value={
                                                values.startAt instanceof Date
                                                    ? values.startAt
                                                          .toISOString()
                                                          .split('T')[0]
                                                    : values.startAt
                                            }
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                setFieldValue(
                                                    'startAt',
                                                    new Date(e.target.value),
                                                )
                                            }
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            error={Boolean(
                                                touched.startAt &&
                                                    errors.startAt,
                                            )}
                                            helperText={
                                                touched.startAt &&
                                                errors.startAt
                                                    ? String(errors.startAt)
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
                                            name="endAt"
                                            label="Fecha de Fin (Opcional)"
                                            type="date"
                                            variant="outlined"
                                            value={
                                                values.endAt instanceof Date
                                                    ? values.endAt
                                                          .toISOString()
                                                          .split('T')[0]
                                                    : values.endAt || ''
                                            }
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                setFieldValue(
                                                    'endAt',
                                                    e.target.value
                                                        ? new Date(
                                                              e.target.value,
                                                          )
                                                        : null,
                                                )
                                            }
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            error={Boolean(
                                                touched.endAt && errors.endAt,
                                            )}
                                            helperText={
                                                touched.endAt && errors.endAt
                                                    ? String(errors.endAt)
                                                    : ''
                                            }
                                        />
                                    </Box>
                                </Box>

                                <Alert severity="info" sx={{ mb: 3 }}>
                                    <Typography variant="body2">
                                        <strong>Nota:</strong> Esto asignará el
                                        rol seleccionado al usuario. Puede
                                        establecer una fecha de fin opcional
                                        para que la asignación del rol expire
                                        automáticamente.
                                    </Typography>
                                </Alert>

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <GenericButton type="submit">
                                        Asignar Rol
                                    </GenericButton>
                                    <GenericButton
                                        type="button"
                                        onClick={() => navigate(-1)}
                                    >
                                        Cancelar
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

export default AssignRole;
