import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Session } from '../../models/Session';
import { getSessionService } from '../../services/sessionService';

const CreateSession: React.FC = () => {
    const { id: userId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const service = getSessionService(userId!);

    const [form, setForm] = useState<Partial<Session>>({
        token: '',
        expiration: '',
        FACode: '',
        state: '',
    });

    const [localDate, setLocalDate] = useState<string>(''); // para input datetime-local

    useEffect(() => {
        const token = localStorage.getItem('token') || '';
        const facode = generateFACode();
        setForm((prev) => ({ ...prev, token, FACode: facode }));
    }, []);

    const generateFACode = () => {
        return 'FA' + Math.random().toString(36).substring(2, 10).toUpperCase();
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalDate(e.target.value);
        if (e.target.value) {
            // Formateamos YYYY-MM-DDTHH:mm a YYYY-MM-DD HH:mm:ss
            const date = new Date(e.target.value);
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const hh = String(date.getHours()).padStart(2, '0');
            const min = String(date.getMinutes()).padStart(2, '0');
            const ss = String(date.getSeconds()).padStart(2, '0');
            setForm((prev) => ({
                ...prev,
                expiration: `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`,
            }));
        }
    };

    const handleSubmit = async () => {
        if (!form.expiration || !form.state) {
            Swal.fire(
                'Error',
                'Por favor complete todos los campos obligatorios',
                'error',
            );
            return;
        }

        try {
            await service.create(form as Omit<Session, 'id'>);
            Swal.fire(
                'Creado',
                'La sesión se ha creado correctamente',
                'success',
            );
            navigate(`/sessions/user/${userId}`);
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'No se pudo crear la sesión', 'error');
        }
    };

    return (
        <div className="card p-3">
            <h4>Crear Sesión</h4>

            <div className="mb-2">
                <label>Token</label>
                <input
                    name="token"
                    value={form.token}
                    readOnly
                    className="form-control bg-light"
                />
            </div>

            <div className="mb-2">
                <label>Expiration</label>
                <input
                    type="datetime-local"
                    value={localDate}
                    onChange={handleDateChange}
                    className="form-control"
                />
            </div>

            <div className="mb-2">
                <label>FACode</label>
                <input
                    name="FACode"
                    value={form.FACode}
                    readOnly
                    className="form-control bg-light"
                />
            </div>

            <div className="mb-2">
                <label>State</label>
                <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="form-control"
                >
                    <option value="">Seleccione estado</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            <button className="btn btn-primary mt-2" onClick={handleSubmit}>
                Crear
            </button>
        </div>
    );
};

export default CreateSession;
