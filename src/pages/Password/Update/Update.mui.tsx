import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { passwordService } from '../../../services/passwordService';
import type { Password } from '../../../models/Password';
import Breadcrumb from '../../../components/Breadcrumb';
import GenericButton from '../../../components/GenericButton';
import toast from 'react-hot-toast';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Alert,
    CircularProgress,
    IconButton,
    InputAdornment,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const UpdatePassword: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [password, setPassword] = useState<Password | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    useEffect(() => {
        if (id) {
            loadPassword(Number.parseInt(id));
        }
    }, [id]);

    const loadPassword = async (passwordId: number) => {
        try {
            setLoading(true);
            const data = await passwordService.getPasswordById(passwordId);
            setPassword(data);
            setError(null);
        } catch (error) {
            console.error('Error loading password:', error);
            setError('No se pudo cargar la contraseña');
            toast.error('Failed to load password');
        } finally {
            setLoading(false);
        }
    };

    const validationSchema = Yup.object({
        content: Yup.string()
            .min(8, 'La contraseña debe tener al menos 8 caracteres')
            .required('La contraseña es requerida'),
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
        content: string;
        startAt: Date;
        endAt: Date | null;
    }) => {
        if (!id) return;

        try {
            const passwordData: any = {
                id: Number.parseInt(id),
                user_id: password?.user_id,
                content: values.content,
                startAt: formatDateForBackend(values.startAt),
                endAt: values.endAt ? formatDateForBackend(values.endAt) : null,
            };

            const result = await passwordService.updatePassword(
                Number.parseInt(id),
                passwordData,
            );
            if (result) {
                toast.success('¡Contraseña actualizada exitosamente!');
                navigate(-1);
            } else {
                toast.error('No se pudo actualizar la contraseña');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            toast.error('Ocurrió un error al actualizar la contraseña');
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const parseDateString = (dateString: string | Date): Date => {
        if (dateString instanceof Date) return dateString;
        return new Date(dateString);
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

    if (!password) {
        return (
            <>
                <Breadcrumb pageName="Actualizar Contraseña" />
                <Paper sx={{ borderRadius: 1, boxShadow: 1, p: 3 }}>
                    <Alert severity="warning">Contraseña no encontrada.</Alert>
                </Paper>
            </>
        );
    }

    return (
        <>
            <Breadcrumb pageName="Actualizar Contraseña" />
            <Paper sx={{ borderRadius: 1, boxShadow: 1 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        Editar Entrada de Contraseña
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
                            content: password.content,
                            startAt: parseDateString(password.startAt),
                            endAt: password.endAt
                                ? parseDateString(password.endAt)
                                : null,
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
                                            fullWidth
                                            name="content"
                                            label="Contraseña *"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder="Ingrese la contraseña"
                                            variant="outlined"
                                            error={Boolean(
                                                touched.content &&
                                                    errors.content,
                                            )}
                                            helperText={
                                                touched.content &&
                                                errors.content
                                                    ? String(errors.content)
                                                    : ''
                                            }
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={
                                                                handleClickShowPassword
                                                            }
                                                            edge="end"
                                                        >
                                                            {showPassword ? (
                                                                <VisibilityOff />
                                                            ) : (
                                                                <Visibility />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
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
                                            label="Fecha de Fin"
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

                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 2,
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <GenericButton type="submit">
                                        Actualizar Contraseña
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

export default UpdatePassword;
