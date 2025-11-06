import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deviceService } from '../../services/deviceService';
import { userService } from '../../services/userService';
import { Device } from '../../models/Device';
import { User } from '../../models/User';
import Swal from 'sweetalert2';
import {
    Box,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    IconButton,
    Avatar,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    CircularProgress,
    Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import LaptopIcon from '@mui/icons-material/Laptop';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoIcon from '@mui/icons-material/Info';

const DevicesListMui: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();

    const [devices, setDevices] = useState<Device[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [editingDevice, setEditingDevice] = useState<Device | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        ip: '',
        operating_system: '',
        is_active: true,
    });

    useEffect(() => {
        if (userId) fetchData(parseInt(userId));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const fetchData = async (id: number) => {
        try {
            setLoading(true);
            const userData = await userService.getUserById(id);
            if (!userData) {
                setError('Usuario no encontrado');
                setLoading(false);
                return;
            }
            setUser(userData);
            const devicesData = await deviceService.getDevicesByUserId(id);
            setDevices(devicesData);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Error al cargar la información');
            setLoading(false);
        }
    };

    const handleBack = () => navigate('/user/list');

    const handleOpen = (device?: Device) => {
        if (device) {
            setEditingDevice(device);
            setFormData({
                name: device.name,
                ip: device.ip,
                operating_system: device.operating_system,
                is_active: device.is_active,
            });
        } else {
            setEditingDevice(null);
            setFormData({
                name: '',
                ip: '',
                operating_system: '',
                is_active: true,
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingDevice(null);
        setFormData({
            name: '',
            ip: '',
            operating_system: '',
            is_active: true,
        });
    };

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | { name?: string; value: unknown }
        >,
    ) => {
        const name =
            (e.target as HTMLInputElement).name || (e.target as any).name;
        const value =
            (e.target as HTMLInputElement).type === 'checkbox'
                ? (e.target as HTMLInputElement).checked
                : (e.target as HTMLInputElement).value;
        setFormData({ ...formData, [name as string]: value });
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!formData.name || !formData.ip || !formData.operating_system) {
            await Swal.fire(
                'Error',
                'Todos los campos son obligatorios',
                'error',
            );
            return;
        }

        try {
            let success;
            let title = '';
            let message = '';

            if (editingDevice) {
                success = await deviceService.updateDevice(
                    editingDevice.id!,
                    formData,
                );
                title = 'Actualizado';
                message = 'Dispositivo actualizado correctamente';
            } else {
                success = await deviceService.createDevice({
                    user_id: parseInt(userId!),
                    ...formData,
                });
                title = 'Creado';
                message = 'Dispositivo registrado correctamente';
            }

            if (success) {
                // Close local dialog before showing global alert to avoid nested modals and aria-hidden conflicts
                handleClose();
                await Swal.fire(title, message, 'success');
                fetchData(parseInt(userId!));
            } else {
                await Swal.fire(
                    'Error',
                    'No se pudo guardar el dispositivo',
                    'error',
                );
            }
        } catch (err) {
            console.error(err);
            await Swal.fire('Error', 'Ocurrió un error al guardar', 'error');
        }
    };

    const handleDelete = async (device: Device) => {
        const result = await Swal.fire({
            title: 'Eliminar dispositivo',
            text: `¿Estás seguro de eliminar "${device.name}"? Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            const success = await deviceService.deleteDevice(device.id!);
            if (success) {
                await Swal.fire(
                    'Eliminado',
                    'El dispositivo ha sido eliminado',
                    'success',
                );
                fetchData(parseInt(userId!));
            } else {
                await Swal.fire(
                    'Error',
                    'No se pudo eliminar el dispositivo',
                    'error',
                );
            }
        }
    };

    const handleToggleActive = async (device: Device) => {
        const action = device.is_active ? 'desactivar' : 'activar';
        const result = await Swal.fire({
            title: `${action.charAt(0).toUpperCase() + action.slice(1)} dispositivo`,
            text: `¿Estás seguro de ${action} "${device.name}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Sí, ${action}`,
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            const success = await deviceService.updateDevice(device.id!, {
                is_active: !device.is_active,
            });
            if (success) {
                await Swal.fire(
                    'Listo',
                    `El dispositivo ha sido ${action}do`,
                    'success',
                );
                fetchData(parseInt(userId!));
            } else {
                await Swal.fire(
                    'Error',
                    `No se pudo ${action} el dispositivo`,
                    'error',
                );
            }
        }
    };

    const getStatusChip = (isActive: boolean) =>
        isActive ? (
            <Chip label="Activo" color="success" size="small" />
        ) : (
            <Chip label="Inactivo" color="default" size="small" />
        );

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight={400}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={4}
            >
                <Box>
                    <Typography variant="h5">
                        Dispositivos Registrados
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Usuario: <strong>{user?.name}</strong> ({user?.email})
                    </Typography>
                </Box>

                <Box display="flex" gap={1}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpen()}
                    >
                        Nuevo Dispositivo
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={handleBack}
                    >
                        Volver
                    </Button>
                </Box>
            </Box>

            {devices.length === 0 ? (
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                        <LaptopIcon
                            sx={{ fontSize: 48, color: 'text.secondary' }}
                        />
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{ mt: 2 }}
                        >
                            No hay dispositivos registrados
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                            Este usuario aún no tiene dispositivos registrados.
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpen()}
                        >
                            Registrar Primer Dispositivo
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Box
                    sx={{
                        display: 'grid',
                        gap: 3,
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: 'repeat(2, 1fr)',
                            lg: 'repeat(3, 1fr)',
                        },
                    }}
                >
                    {devices.map((device) => (
                        <Box key={device.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <CardContent sx={{ flex: 1 }}>
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="flex-start"
                                        mb={2}
                                    >
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            gap={2}
                                        >
                                            <Avatar
                                                sx={{
                                                    bgcolor: device.is_active
                                                        ? 'primary.main'
                                                        : 'grey.500',
                                                }}
                                            >
                                                <LaptopIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1">
                                                    {device.name}
                                                </Typography>
                                                {getStatusChip(
                                                    device.is_active,
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Box mb={2}>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Sistema Operativo
                                        </Typography>
                                        <Typography>
                                            {device.operating_system}
                                        </Typography>
                                    </Box>

                                    <Box mb={2}>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Dirección IP
                                        </Typography>
                                        <Typography
                                            sx={{ fontFamily: 'monospace' }}
                                        >
                                            {device.ip}
                                        </Typography>
                                    </Box>

                                    {device.last_login && (
                                        <Box>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                Último acceso
                                            </Typography>
                                            <Typography>
                                                {new Date(
                                                    device.last_login,
                                                ).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>

                                <CardActions>
                                    <Button
                                        startIcon={<EditIcon />}
                                        size="small"
                                        onClick={() => handleOpen(device)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        startIcon={
                                            device.is_active ? (
                                                <PauseIcon />
                                            ) : (
                                                <PlayArrowIcon />
                                            )
                                        }
                                        size="small"
                                        onClick={() =>
                                            handleToggleActive(device)
                                        }
                                    >
                                        {device.is_active
                                            ? 'Desactivar'
                                            : 'Activar'}
                                    </Button>
                                    <IconButton
                                        onClick={() => handleDelete(device)}
                                        sx={{ ml: 'auto' }}
                                        aria-label="delete"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>

                                {device.created_at && (
                                    <Box
                                        sx={{
                                            px: 2,
                                            py: 1,
                                            bgcolor: 'background.default',
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            <CalendarTodayIcon
                                                sx={{
                                                    fontSize: 14,
                                                    verticalAlign: 'middle',
                                                    mr: 0.5,
                                                }}
                                            />
                                            Registrado:{' '}
                                            {new Date(
                                                device.created_at,
                                            ).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                )}
                            </Card>
                        </Box>
                    ))}
                </Box>
            )}

            {devices.length > 0 && (
                <Box mt={3}>
                    <Alert icon={<InfoIcon />} severity="info">
                        <strong>Total:</strong> {devices.length} |{' '}
                        <strong>Activos:</strong>{' '}
                        {devices.filter((d) => d.is_active).length} |{' '}
                        <strong>Inactivos:</strong>{' '}
                        {devices.filter((d) => !d.is_active).length}
                    </Alert>
                </Box>
            )}

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    {editingDevice ? 'Editar Dispositivo' : 'Nuevo Dispositivo'}
                </DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ mt: 1, display: 'grid', gap: 2 }}
                    >
                        <TextField
                            name="name"
                            label="Nombre del Dispositivo"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            name="ip"
                            label="Dirección IP"
                            value={formData.ip}
                            onChange={handleInputChange}
                            required
                        />

                        <FormControl fullWidth>
                            <InputLabel id="os-label">
                                Sistema Operativo
                            </InputLabel>
                            <Select
                                labelId="os-label"
                                label="Sistema Operativo"
                                name="operating_system"
                                value={formData.operating_system}
                                onChange={handleInputChange as any}
                                required
                            >
                                <MenuItem value="">Seleccionar...</MenuItem>
                                <MenuItem value="Windows 11">
                                    Windows 11
                                </MenuItem>
                                <MenuItem value="Windows 10">
                                    Windows 10
                                </MenuItem>
                                <MenuItem value="macOS Sonoma">
                                    macOS Sonoma
                                </MenuItem>
                                <MenuItem value="macOS Ventura">
                                    macOS Ventura
                                </MenuItem>
                                <MenuItem value="iOS 17">iOS 17</MenuItem>
                                <MenuItem value="iOS 16">iOS 16</MenuItem>
                                <MenuItem value="Android 14">
                                    Android 14
                                </MenuItem>
                                <MenuItem value="Android 13">
                                    Android 13
                                </MenuItem>
                                <MenuItem value="Ubuntu 22.04">
                                    Ubuntu 22.04
                                </MenuItem>
                                <MenuItem value="Ubuntu 20.04">
                                    Ubuntu 20.04
                                </MenuItem>
                            </Select>
                        </FormControl>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.is_active}
                                    name="is_active"
                                    onChange={handleInputChange as any}
                                />
                            }
                            label="Dispositivo activo"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button
                        variant="contained"
                        onClick={() => handleSubmit()}
                        startIcon={<AddIcon />}
                    >
                        {editingDevice ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DevicesListMui;
