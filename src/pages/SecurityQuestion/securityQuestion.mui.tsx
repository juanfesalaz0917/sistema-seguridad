import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { securityQuestionService } from '../../services/securityQuestionService';
import { userService } from '../../services/userService';
import { SecurityQuestion } from '../../models/SecurityQuestion';
import { UserSecurityAnswerView } from '../../models/UserSecurityAnswer';
import { User } from '../../models/User';
import Swal from 'sweetalert2';
import GenericButton from '../../components/GenericButton';
import {
    Box,
    Card,
    CardContent,
    CardActions,
    Typography,
    CircularProgress,
    Alert,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    useTheme,
    alpha,
    SelectChangeEvent,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Lock as LockIcon,
    Shield as ShieldIcon,
    QuestionMark as QuestionMarkIcon,
    CheckCircle as CheckCircleIcon,
    CalendarToday as CalendarIcon,
    Save as SaveIcon,
    Close as CloseIcon,
} from '@mui/icons-material';

const SecurityQuestionsMui: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const theme = useTheme();

    const [user, setUser] = useState<User | null>(null);
    const [allQuestions, setAllQuestions] = useState<SecurityQuestion[]>([]);
    const [userAnswers, setUserAnswers] = useState<UserSecurityAnswerView[]>(
        [],
    );
    const [loading, setLoading] = useState<boolean>(true);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editingAnswer, setEditingAnswer] =
        useState<UserSecurityAnswerView | null>(null);
    const [formData, setFormData] = useState({
        security_question_id: 0,
        answer: '',
    });

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

            // Obtener todas las preguntas disponibles
            const questionsData =
                await securityQuestionService.getAllQuestions();
            setAllQuestions(questionsData);

            // Obtener respuestas del usuario
            const answersData =
                await securityQuestionService.getUserAnswers(id);
            setUserAnswers(answersData);

            setLoading(false);
        } catch (err) {
            console.error('Error:', err);
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/user/list');
    };

    const handleOpenModal = (answer?: UserSecurityAnswerView) => {
        if (answer) {
            // Editar respuesta existente
            setEditingAnswer(answer);
            setFormData({
                security_question_id: answer.security_question_id,
                answer: '', // No mostrar la respuesta actual por seguridad
            });
        } else {
            // Crear nueva respuesta
            setEditingAnswer(null);
            setFormData({
                security_question_id: 0,
                answer: '',
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingAnswer(null);
        setFormData({
            security_question_id: 0,
            answer: '',
        });
    };

    const handleInputChange = (
        e:
            | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            | SelectChangeEvent<number | string>,
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name as string]:
                name === 'security_question_id'
                    ? parseInt(value as string)
                    : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.security_question_id || !formData.answer.trim()) {
            Swal.fire(
                'Error',
                'Debes seleccionar una pregunta y proporcionar una respuesta',
                'error',
            );
            return;
        }

        try {
            let success;
            if (editingAnswer) {
                // Actualizar respuesta existente
                success = await securityQuestionService.updateAnswer(
                    editingAnswer.id!,
                    formData.answer,
                );
                if (success) {
                    await Swal.fire(
                        'Actualizada',
                        'Respuesta actualizada correctamente',
                        'success',
                    );
                }
            } else {
                // Crear nueva respuesta
                success = await securityQuestionService.createAnswer({
                    user_id: parseInt(userId!),
                    security_question_id: formData.security_question_id,
                    answer: formData.answer,
                });
                if (success) {
                    await Swal.fire(
                        'Creada',
                        'Respuesta registrada correctamente',
                        'success',
                    );
                }
            }

            if (success) {
                handleCloseModal();
                fetchData(parseInt(userId!));
            } else {
                Swal.fire('Error', 'No se pudo guardar la respuesta', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Ocurrió un error al guardar', 'error');
        }
    };

    const handleDelete = async (answer: UserSecurityAnswerView) => {
        const result = await Swal.fire({
            title: 'Eliminar respuesta',
            text: `¿Estás seguro de eliminar la respuesta a "${answer.question_name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            const success = await securityQuestionService.deleteAnswer(
                answer.id!,
            );
            if (success) {
                await Swal.fire(
                    'Eliminada',
                    'La respuesta ha sido eliminada',
                    'success',
                );
                fetchData(parseInt(userId!));
            } else {
                Swal.fire('Error', 'No se pudo eliminar la respuesta', 'error');
            }
        }
    };

    // Filtrar preguntas que ya han sido respondidas
    const getAvailableQuestions = () => {
        const answeredQuestionIds = userAnswers.map(
            (a) => a.security_question_id,
        );
        return allQuestions.filter((q) => !answeredQuestionIds.includes(q.id!));
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
                    alignItems: 'flex-start',
                    mb: 4,
                    flexWrap: 'wrap',
                    gap: 2,
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{ fontWeight: 600, mb: 1 }}
                    >
                        Preguntas de Seguridad
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Usuario: <strong>{user?.name}</strong> ({user?.email})
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {getAvailableQuestions().length > 0 && (
                        <GenericButton
                            variant="primary"
                            onClick={() => handleOpenModal()}
                        >
                            <AddIcon sx={{ mr: 1, fontSize: 20 }} />
                            Agregar Respuesta
                        </GenericButton>
                    )}
                    <GenericButton variant="secondary" onClick={handleBack}>
                        <ArrowBackIcon sx={{ mr: 1, fontSize: 20 }} />
                        Volver
                    </GenericButton>
                </Box>
            </Box>

            {/* Información de seguridad */}
            <Alert severity="info" icon={<ShieldIcon />} sx={{ mb: 4 }}>
                Las preguntas de seguridad ayudan a recuperar el acceso a tu
                cuenta. Se recomienda configurar al menos 3 preguntas.
            </Alert>

            {/* Lista de respuestas configuradas */}
            {userAnswers.length === 0 ? (
                <Card elevation={3}>
                    <CardContent
                        sx={{
                            textAlign: 'center',
                            py: 8,
                        }}
                    >
                        <QuestionMarkIcon
                            sx={{
                                fontSize: 80,
                                color: 'text.secondary',
                                mb: 2,
                            }}
                        />
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            gutterBottom
                        >
                            No hay preguntas de seguridad configuradas
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 3 }}
                        >
                            Agrega preguntas de seguridad para proteger tu
                            cuenta.
                        </Typography>
                        {getAvailableQuestions().length > 0 && (
                            <GenericButton
                                variant="primary"
                                onClick={() => handleOpenModal()}
                            >
                                <AddIcon sx={{ mr: 1, fontSize: 20 }} />
                                Configurar Primera Pregunta
                            </GenericButton>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    {userAnswers.map((answer, index) => (
                        <Card key={answer.id} elevation={3}>
                            <CardContent>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        gap: 2,
                                    }}
                                >
                                    <Box sx={{ flex: 1 }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                mb: 1,
                                            }}
                                        >
                                            <Chip
                                                label={index + 1}
                                                color="primary"
                                                size="small"
                                            />
                                            <Typography
                                                variant="h6"
                                                component="h3"
                                            >
                                                {answer.question_name}
                                            </Typography>
                                        </Box>
                                        {answer.question_description && (
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ mb: 2 }}
                                            >
                                                {answer.question_description}
                                            </Typography>
                                        )}
                                        <Alert
                                            severity="info"
                                            icon={<LockIcon />}
                                            sx={{ mt: 2 }}
                                        >
                                            <Typography variant="caption">
                                                Respuesta configurada y
                                                encriptada
                                            </Typography>
                                        </Alert>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton
                                            size="small"
                                            color="warning"
                                            onClick={() =>
                                                handleOpenModal(answer)
                                            }
                                            title="Cambiar respuesta"
                                            sx={{
                                                border: 1,
                                                borderColor: 'warning.main',
                                            }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDelete(answer)}
                                            title="Eliminar"
                                            sx={{
                                                border: 1,
                                                borderColor: 'error.main',
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </CardContent>
                            {answer.created_at && (
                                <CardActions
                                    sx={{
                                        bgcolor: alpha(
                                            theme.palette.background.default,
                                            0.5,
                                        ),
                                        px: 2,
                                        py: 1,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                        }}
                                    >
                                        <CalendarIcon
                                            fontSize="small"
                                            color="action"
                                        />
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Configurada:{' '}
                                            {new Date(
                                                answer.created_at,
                                            ).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </CardActions>
                            )}
                        </Card>
                    ))}
                </Box>
            )}

            {/* Resumen */}
            {userAnswers.length > 0 && (
                <Alert
                    severity="success"
                    icon={<CheckCircleIcon />}
                    sx={{ mt: 4 }}
                >
                    <Typography variant="body2">
                        <strong>Preguntas configuradas:</strong>{' '}
                        {userAnswers.length} de {allQuestions.length}
                    </Typography>
                </Alert>
            )}

            {/* Modal de Crear/Editar */}
            <Dialog
                open={showModal}
                onClose={handleCloseModal}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="h6">
                            {editingAnswer
                                ? 'Cambiar Respuesta'
                                : 'Nueva Pregunta de Seguridad'}
                        </Typography>
                        <IconButton
                            size="small"
                            onClick={handleCloseModal}
                            sx={{ color: 'text.secondary' }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent dividers>
                        {!editingAnswer ? (
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel id="question-select-label">
                                    Pregunta de Seguridad *
                                </InputLabel>
                                <Select
                                    labelId="question-select-label"
                                    name="security_question_id"
                                    value={formData.security_question_id || ''}
                                    onChange={handleInputChange}
                                    label="Pregunta de Seguridad *"
                                    required
                                >
                                    <MenuItem value="">
                                        <em>Seleccionar pregunta...</em>
                                    </MenuItem>
                                    {getAvailableQuestions().map((q) => (
                                        <MenuItem key={q.id} value={q.id}>
                                            {q.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        ) : (
                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    Pregunta:
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                    {editingAnswer.question_name}
                                </Typography>
                            </Box>
                        )}

                        <TextField
                            fullWidth
                            label="Tu Respuesta *"
                            name="answer"
                            value={formData.answer}
                            onChange={handleInputChange}
                            placeholder="Ingresa tu respuesta"
                            required
                            autoComplete="off"
                            helperText="Esta respuesta se utilizará para verificar tu identidad. No la compartas con nadie."
                        />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, py: 2 }}>
                        <GenericButton
                            variant="secondary"
                            onClick={handleCloseModal}
                        >
                            Cancelar
                        </GenericButton>
                        <GenericButton variant="success" type="submit">
                            <SaveIcon sx={{ mr: 1, fontSize: 20 }} />
                            {editingAnswer ? 'Actualizar' : 'Guardar'}
                        </GenericButton>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default SecurityQuestionsMui;
