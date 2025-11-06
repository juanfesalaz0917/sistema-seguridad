import type React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { passwordService } from '../../../services/passwordService';
import Breadcrumb from '../../../components/Breadcrumb';
import GenericButton from '../../../components/GenericButton';
import toast from 'react-hot-toast';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Alert,
    IconButton,
    InputAdornment,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';

const CreatePassword: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const validationSchema = Yup.object({
        content: Yup.string()
            .min(8, 'La contraseña debe tener al menos 8 caracteres')
            .required('La contraseña es requerida'),
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
        content: string;
        startAt: Date;
        endAt: Date | null;
    }) => {
        if (!userId) {
            toast.error('Se requiere el ID de usuario');
            return;
        }

        try {
            const passwordData: any = {
                user_id: Number.parseInt(userId),
                content: values.content,
                startAt: formatDateForBackend(values.startAt),
                endAt: values.endAt ? formatDateForBackend(values.endAt) : null,
            };

            const result = await passwordService.createPassword(
                Number.parseInt(userId),
                passwordData,
            );
            if (result) {
                toast.success('¡Contraseña creada exitosamente!');
                navigate(`/user/passwords/${userId}`);
            } else {
                toast.error('No se pudo crear la contraseña');
            }
        } catch (error) {
            console.error('Error creating password:', error);
            toast.error('Ocurrió un error al crear la contraseña');
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <Breadcrumb pageName="Crear Contraseña" />
            <Paper sx={{ borderRadius: 1, boxShadow: 1 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        Nueva Entrada de Contraseña
                    </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                    <Formik
                        initialValues={{
                            content: '',
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
                                        <strong>Nota:</strong> Esto crea una
                                        entrada en el historial de contraseñas.
                                        La contraseña se almacenará de forma
                                        segura y se puede usar para rastrear
                                        cambios de contraseña a lo largo del
                                        tiempo.
                                    </Typography>
                                </Alert>

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <GenericButton type="submit">
                                        Crear Contraseña
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

export default CreatePassword;
