// src/pages/SecurityQuestions/SecurityQuestions.bootstrap.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { securityQuestionService } from "../../services/securityQuestionService";
import { userService } from "../../services/userService";
import { SecurityQuestion } from "../../models/SecurityQuestion";
import { UserSecurityAnswerView } from "../../models/UserSecurityAnswer";
import { User } from "../../models/User";
import Swal from "sweetalert2";

const SecurityQuestionsBootstrap: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [allQuestions, setAllQuestions] = useState<SecurityQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserSecurityAnswerView[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingAnswer, setEditingAnswer] = useState<UserSecurityAnswerView | null>(null);
  const [formData, setFormData] = useState({
    security_question_id: 0,
    answer: "",
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
        Swal.fire("Error", "Usuario no encontrado", "error");
        navigate("/user/list");
        return;
      }
      setUser(userData);

      // Obtener todas las preguntas disponibles
      const questionsData = await securityQuestionService.getAllQuestions();
      setAllQuestions(questionsData);

      // Obtener respuestas del usuario
      const answersData = await securityQuestionService.getUserAnswers(id);
      setUserAnswers(answersData);

      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/user/list");
  };

  const handleOpenModal = (answer?: UserSecurityAnswerView) => {
    if (answer) {
      // Editar respuesta existente
      setEditingAnswer(answer);
      setFormData({
        security_question_id: answer.security_question_id,
        answer: "", // No mostrar la respuesta actual por seguridad
      });
    } else {
      // Crear nueva respuesta
      setEditingAnswer(null);
      setFormData({
        security_question_id: 0,
        answer: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAnswer(null);
    setFormData({
      security_question_id: 0,
      answer: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "security_question_id" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.security_question_id || !formData.answer.trim()) {
      Swal.fire("Error", "Debes seleccionar una pregunta y proporcionar una respuesta", "error");
      return;
    }

    try {
      let success;
      if (editingAnswer) {
        // Actualizar respuesta existente
        success = await securityQuestionService.updateAnswer(editingAnswer.id!, formData.answer);
        if (success) {
          await Swal.fire("Actualizada", "Respuesta actualizada correctamente", "success");
        }
      } else {
        // Crear nueva respuesta
        success = await securityQuestionService.createAnswer({
          user_id: parseInt(userId!),
          security_question_id: formData.security_question_id,
          answer: formData.answer,
        });
        if (success) {
          await Swal.fire("Creada", "Respuesta registrada correctamente", "success");
        }
      }

      if (success) {
        handleCloseModal();
        fetchData(parseInt(userId!));
      } else {
        Swal.fire("Error", "No se pudo guardar la respuesta", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Ocurrió un error al guardar", "error");
    }
  };

  const handleDelete = async (answer: UserSecurityAnswerView) => {
    const result = await Swal.fire({
      title: "Eliminar respuesta",
      text: `¿Estás seguro de eliminar la respuesta a "${answer.question_name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const success = await securityQuestionService.deleteAnswer(answer.id!);
      if (success) {
        await Swal.fire("Eliminada", "La respuesta ha sido eliminada", "success");
        fetchData(parseInt(userId!));
      } else {
        Swal.fire("Error", "No se pudo eliminar la respuesta", "error");
      }
    }
  };

  // Filtrar preguntas que ya han sido respondidas
  const getAvailableQuestions = () => {
    const answeredQuestionIds = userAnswers.map(a => a.security_question_id);
    return allQuestions.filter(q => !answeredQuestionIds.includes(q.id!));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Preguntas de Seguridad</h2>
          <p className="text-muted mb-0">
            Usuario: <strong>{user?.name}</strong> ({user?.email})
          </p>
        </div>
        <div className="d-flex gap-2">
          {getAvailableQuestions().length > 0 && (
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <i className="bi bi-plus-lg me-2"></i>
              Agregar Respuesta
            </button>
          )}
          <button className="btn btn-secondary" onClick={handleBack}>
            <i className="bi bi-arrow-left me-2"></i>
            Volver
          </button>
        </div>
      </div>

      {/* Información de seguridad */}
      <div className="alert alert-info mb-4" role="alert">
        <i className="bi bi-shield-check me-2"></i>
        Las preguntas de seguridad ayudan a recuperar el acceso a tu cuenta. Se recomienda configurar al menos 3 preguntas.
      </div>

      {/* Lista de respuestas configuradas */}
      {userAnswers.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-question-circle fs-1 text-muted mb-3 d-block"></i>
            <h5 className="text-muted">No hay preguntas de seguridad configuradas</h5>
            <p className="text-muted mb-3">
              Agrega preguntas de seguridad para proteger tu cuenta.
            </p>
            {getAvailableQuestions().length > 0 && (
              <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                <i className="bi bi-plus-lg me-2"></i>
                Configurar Primera Pregunta
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {userAnswers.map((answer, index) => (
            <div key={answer.id} className="col-12">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="badge bg-primary">{index + 1}</span>
                        <h6 className="mb-0">{answer.question_name}</h6>
                      </div>
                      {answer.question_description && (
                        <p className="text-muted small mb-2">{answer.question_description}</p>
                      )}
                      <div className="alert alert-secondary mb-0 mt-3">
                        <i className="bi bi-lock-fill me-2"></i>
                        <small>Respuesta configurada y encriptada</small>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => handleOpenModal(answer)}
                        title="Cambiar respuesta"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(answer)}
                        title="Eliminar"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
                {answer.created_at && (
                  <div className="card-footer bg-light">
                    <small className="text-muted">
                      <i className="bi bi-calendar3 me-1"></i>
                      Configurada: {new Date(answer.created_at).toLocaleDateString()}
                    </small>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resumen */}
      {userAnswers.length > 0 && (
        <div className="alert alert-success mt-4" role="alert">
          <i className="bi bi-check-circle me-2"></i>
          <strong>Preguntas configuradas:</strong> {userAnswers.length} de {allQuestions.length}
        </div>
      )}

      {/* Modal de Crear/Editar */}
      {showModal && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingAnswer ? "Cambiar Respuesta" : "Nueva Pregunta de Seguridad"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    {!editingAnswer ? (
                      <div className="mb-3">
                        <label className="form-label">
                          Pregunta de Seguridad <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="security_question_id"
                          value={formData.security_question_id}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Seleccionar pregunta...</option>
                          {getAvailableQuestions().map((q) => (
                            <option key={q.id} value={q.id}>
                              {q.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Pregunta:</label>
                        <p className="text-muted">{editingAnswer.question_name}</p>
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="form-label">
                        Tu Respuesta <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="answer"
                        value={formData.answer}
                        onChange={handleInputChange}
                        placeholder="Ingresa tu respuesta"
                        required
                        autoComplete="off"
                      />
                      <small className="text-muted">
                        Esta respuesta se utilizará para verificar tu identidad. No la compartas con nadie.
                      </small>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseModal}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-check-lg me-2"></i>
                      {editingAnswer ? "Actualizar" : "Guardar"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SecurityQuestionsBootstrap;