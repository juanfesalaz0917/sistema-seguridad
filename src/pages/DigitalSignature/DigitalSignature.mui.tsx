import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { digitalSignatureService } from '../../services/digitalSignatureService';
import { userService } from '../../services/userService';
import { DigitalSignature } from '../../models/DigitalSignature';
import { User } from '../../models/User';
import Swal from 'sweetalert2';
import GenericButton from '../../components/GenericButton';
import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Paper,
    Alert,
    Chip,
    useTheme,
    alpha,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    CheckCircle as CheckCircleIcon,
    Image as ImageIcon,
} from '@mui/icons-material';

const DigitalSignatureMui: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const theme = useTheme();

    const [signature, setSignature] = useState<DigitalSignature | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [uploading, setUploading] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    useEffect(() => {
        if (userId) {
            fetchData(parseInt(userId));
        }
    }, [userId]);

    const fetchData = async (id: number) => {
        try {
            setLoading(true);

            // Obtener usuario
            const userData = await userService.getUserById(id);
            if (!userData) {
                Swal.fire('Error', 'Usuario no encontrado', 'error');
                navigate('/user/list');
                return;
            }
            setUser(userData);

            // Obtener firma digital
            const signatureData =
                await digitalSignatureService.getSignatureByUserId(id);
            setSignature(signatureData);

            if (signatureData?.photo) {
                setPreviewUrl(
                    digitalSignatureService.getImageUrl(signatureData.photo),
                );
            }

            setLoading(false);
        } catch (err) {
            console.error('Error:', err);
            setLoading(false);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            Swal.fire(
                'Error',
                'Por favor selecciona una imagen válida',
                'error',
            );
            return;
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire('Error', 'La imagen no debe superar los 5MB', 'error');
            return;
        }

        setSelectedFile(file);

        // Crear preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        if (!selectedFile) {
            Swal.fire(
                'Error',
                'Debes seleccionar una imagen para la firma',
                'error',
            );
            return;
        }

        const result = await Swal.fire({
            title: signature ? 'Actualizar firma' : 'Crear firma',
            text: signature
                ? '¿Estás seguro de actualizar la firma digital?'
                : '¿Estás seguro de crear la firma digital?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar',
        });

        if (!result.isConfirmed) return;

        try {
            setUploading(true);
            const id = parseInt(userId!);

            let success;
            if (signature?.id) {
                // Actualizar firma existente
                success = await digitalSignatureService.updateSignature(
                    signature.id,
                    selectedFile,
                );
            } else {
                // Crear nueva firma
                success = await digitalSignatureService.createSignature(
                    id,
                    selectedFile,
                );
            }

            setUploading(false);

            if (success) {
                await Swal.fire(
                    'Éxito',
                    signature
                        ? 'Firma actualizada correctamente'
                        : 'Firma creada correctamente',
                    'success',
                );
                setIsEditing(false);
                setSelectedFile(null);
                fetchData(id);
            } else {
                Swal.fire(
                    'Error',
                    'No se pudo guardar la firma digital',
                    'error',
                );
            }
        } catch (error) {
            console.error('Error:', error);
            setUploading(false);
            Swal.fire('Error', 'Ocurrió un error al guardar', 'error');
        }
    };

    const handleDelete = async () => {
        if (!signature?.id) return;

        const result = await Swal.fire({
            title: 'Eliminar firma',
            text: '¿Estás seguro de eliminar la firma digital? Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (!result.isConfirmed) return;

        try {
            setUploading(true);
            const success = await digitalSignatureService.deleteSignature(
                signature.id,
            );
            setUploading(false);

            if (success) {
                await Swal.fire(
                    'Eliminada',
                    'La firma digital ha sido eliminada',
                    'success',
                );
                setSignature(null);
                setPreviewUrl('');
                setIsEditing(false);
            } else {
                Swal.fire(
                    'Error',
                    'No se pudo eliminar la firma digital',
                    'error',
                );
            }
        } catch (error) {
            console.error('Error:', error);
            setUploading(false);
            Swal.fire('Error', 'Ocurrió un error al eliminar', 'error');
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setSelectedFile(null);
        if (signature?.photo) {
            setPreviewUrl(digitalSignatureService.getImageUrl(signature.photo));
        } else {
            setPreviewUrl('');
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleBack = () => {
        navigate('/user/list');
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                }}
            >
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                    flexWrap: 'wrap',
                    gap: 2,
                }}
            >
                <Typography
                    variant="h4"
                    component="h2"
                    sx={{ fontWeight: 600 }}
                >
                    {user?.name} - Signature
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <GenericButton variant="secondary" onClick={handleBack}>
                        <ArrowBackIcon sx={{ mr: 1, fontSize: 20 }} />
                        Volver
                    </GenericButton>
                    {!isEditing && signature && (
                        <>
                            <GenericButton
                                variant="secondary"
                                onClick={() => setIsEditing(true)}
                            >
                                <EditIcon sx={{ mr: 1, fontSize: 20 }} />
                                Editar
                            </GenericButton>
                            <GenericButton
                                variant="danger"
                                onClick={handleDelete}
                                disabled={uploading}
                            >
                                <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
                                Eliminar
                            </GenericButton>
                        </>
                    )}
                    {!isEditing && !signature && (
                        <GenericButton
                            variant="primary"
                            onClick={() => setIsEditing(true)}
                        >
                            <AddIcon sx={{ mr: 1, fontSize: 20 }} />
                            Crear Firma
                        </GenericButton>
                    )}
                </Box>
            </Box>

            {/* Card principal */}
            <Card elevation={3}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: 4,
                        }}
                    >
                        {/* Columna izquierda - Firma */}
                        <Box
                            sx={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRight: { md: 1 },
                                borderColor: { md: 'divider' },
                                pr: { md: 4 },
                            }}
                        >
                            <Typography
                                variant="h6"
                                color="text.secondary"
                                sx={{ mb: 3, fontWeight: 500 }}
                            >
                                Signature
                            </Typography>

                            {/* Vista/Edición de firma */}
                            <Paper
                                variant="outlined"
                                sx={{
                                    width: '100%',
                                    maxWidth: 400,
                                    height: 300,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: alpha(
                                        theme.palette.background.default,
                                        0.5,
                                    ),
                                    position: 'relative',
                                    border: 2,
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                }}
                            >
                                {previewUrl ? (
                                    <Box
                                        component="img"
                                        src={previewUrl}
                                        alt="Digital Signature"
                                        sx={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain',
                                        }}
                                    />
                                ) : (
                                    <Box
                                        sx={{
                                            textAlign: 'center',
                                            color: 'text.secondary',
                                        }}
                                    >
                                        <ImageIcon
                                            sx={{ fontSize: 64, mb: 2 }}
                                        />
                                        <Typography variant="body1">
                                            {isEditing
                                                ? 'Selecciona una imagen'
                                                : 'No hay firma digital registrada'}
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>

                            {/* Input de archivo en modo edición */}
                            {isEditing && (
                                <Box
                                    sx={{ mt: 3, width: '100%', maxWidth: 400 }}
                                >
                                    <GenericButton
                                        variant="secondary"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                    >
                                        <ImageIcon
                                            sx={{ mr: 1, fontSize: 20 }}
                                        />
                                        Seleccionar Imagen
                                    </GenericButton>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                    />
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        display="block"
                                        sx={{ mt: 1 }}
                                    >
                                        Formatos: JPG, PNG, GIF. Máximo: 5MB
                                    </Typography>
                                </Box>
                            )}

                            {/* Botones de acción en modo edición */}
                            {isEditing && (
                                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                                    <GenericButton
                                        variant="success"
                                        onClick={handleSave}
                                        disabled={uploading || !selectedFile}
                                    >
                                        {uploading ? (
                                            <>
                                                <CircularProgress
                                                    size={20}
                                                    color="inherit"
                                                    sx={{ mr: 1 }}
                                                />
                                                Guardando...
                                            </>
                                        ) : (
                                            <>
                                                <SaveIcon
                                                    sx={{ mr: 1, fontSize: 20 }}
                                                />
                                                Guardar
                                            </>
                                        )}
                                    </GenericButton>
                                    <GenericButton
                                        variant="secondary"
                                        onClick={handleCancel}
                                        disabled={uploading}
                                    >
                                        <CancelIcon
                                            sx={{ mr: 1, fontSize: 20 }}
                                        />
                                        Cancelar
                                    </GenericButton>
                                </Box>
                            )}
                        </Box>

                        {/* Columna derecha - Información del usuario */}
                        <Box
                            sx={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}
                        >
                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    Name:
                                </Typography>
                                <Typography variant="h6" sx={{ mt: 0.5 }}>
                                    {user?.name || 'N/A'}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    Email:
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ mt: 0.5, wordBreak: 'break-word' }}
                                >
                                    {user?.email || 'N/A'}
                                </Typography>
                            </Box>

                            {signature && (
                                <>
                                    <Box sx={{ mb: 3 }}>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{
                                                fontWeight: 600,
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            Estado:
                                        </Typography>
                                        <Box sx={{ mt: 1 }}>
                                            <Chip
                                                icon={<CheckCircleIcon />}
                                                label="Firma Registrada"
                                                color="success"
                                                size="small"
                                            />
                                        </Box>
                                    </Box>

                                    {signature.created_at && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{
                                                    fontWeight: 600,
                                                    textTransform: 'uppercase',
                                                }}
                                            >
                                                Fecha de creación:
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{ mt: 0.5 }}
                                            >
                                                {new Date(
                                                    signature.created_at,
                                                ).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    )}

                                    {signature.updated_at && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{
                                                    fontWeight: 600,
                                                    textTransform: 'uppercase',
                                                }}
                                            >
                                                Última actualización:
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{ mt: 0.5 }}
                                            >
                                                {new Date(
                                                    signature.updated_at,
                                                ).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    )}
                                </>
                            )}

                            {!signature && (
                                <Alert severity="warning" icon={<ImageIcon />}>
                                    Este usuario aún no tiene una firma digital
                                    registrada.
                                </Alert>
                            )}
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default DigitalSignatureMui;
