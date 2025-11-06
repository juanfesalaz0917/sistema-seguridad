import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { RootState, store } from '../../store/store';
import { setUser } from '../../store/userSlice';
import { profileService } from '../../services/profileService';
import GenericButton from '../../components/GenericButton/index';

interface FormValues {
    phone: string;
    photoFile: File | null;
}

// 🔹 Validación: al menos 10 números
const phoneSchema = Yup.string()
    .required('El teléfono es obligatorio')
    .test('min-numbers', 'El teléfono debe tener al menos 10 números', (value) => {
        if (!value) return false;
        const digits = value.replace(/\D/g, ''); // quitar todo lo que no sea número
        return digits.length >= 10;
    });

const UpdateProfile: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const user = useSelector((state: RootState) => state.user.user);

    const [initialValues, setInitialValues] = useState<FormValues>({
        phone: '',
        photoFile: null,
    });

    const [photoPreview, setPhotoPreview] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!id) return;

        profileService
            .getById(id)
            .then((profile) => {
                setInitialValues({ phone: profile.phone || '', photoFile: null });

                if (profile.photo) {
                    const apiUrl = import.meta.env.VITE_API_URL;
                    setPhotoPreview(`${apiUrl}/${profile.photo}`);
                }
            })
            .catch(() => {
                Swal.fire('Error', 'No se pudo cargar el perfil', 'error');
            });
    }, [id]);

    const handleSubmit = async (values: FormValues) => {
        if (!id) return;
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('phone', values.phone);
            if (values.photoFile) formData.append('photo', values.photoFile);

            const updatedProfile = await profileService.update(id, formData);

            if (user && user.id?.toString() === id && updatedProfile.photo) {
                const apiUrl = import.meta.env.VITE_API_URL;
                let newPhotoUrl = updatedProfile.photo;
                if (!newPhotoUrl.startsWith('http')) {
                    newPhotoUrl = `${apiUrl}${newPhotoUrl.startsWith('/') ? '' : '/'}${newPhotoUrl}`;
                }
                const updatedUser = { ...user, photo_url: newPhotoUrl };
                store.dispatch(setUser(updatedUser));
            }

            Swal.fire('¡Perfil actualizado!', '', 'success');
            navigate('/user/list');
        } catch (error) {
            console.error(error);
            Swal.fire('Error al actualizar perfil', '', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-16 px-4">
            <div className="w-full max-w-lg bg-white p-8 rounded shadow">
                <h2 className="text-2xl font-bold mb-6">Actualizar Perfil</h2>

                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={Yup.object({ phone: phoneSchema })}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue }) => (
                        <Form>
                            <div className="mb-4">
                                <label className="block font-medium mb-2">Teléfono</label>
                                <Field
                                    name="phone"
                                    type="text"
                                    placeholder="+57 300 123 4567"
                                    className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={loading}
                                />
                                <ErrorMessage
                                    name="phone"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block font-medium mb-2">Foto de Perfil</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setFieldValue('photoFile', e.target.files[0]);
                                            const reader = new FileReader();
                                            reader.onloadend = () =>
                                                setPhotoPreview(reader.result as string);
                                            reader.readAsDataURL(e.target.files[0]);
                                        }
                                    }}
                                    disabled={loading}
                                    className="w-full border rounded px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {photoPreview && (
                                    <div className="mt-4 flex justify-center">
                                        <img
                                            src={photoPreview}
                                            alt="Preview"
                                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <GenericButton
                                    type="submit"
                                    variant="primary"
                                    disabled={loading}
                                    className="flex-1"
                                >
                                    {loading ? 'Actualizando...' : '💾 Actualizar Perfil'}
                                </GenericButton>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default UpdateProfile;
