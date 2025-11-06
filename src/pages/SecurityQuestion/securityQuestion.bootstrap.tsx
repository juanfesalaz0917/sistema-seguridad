// src/pages/SecurityQuestions/SecurityQuestions.bootstrap.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { securityQuestionService } from "../../services/securityQuestionService";
import { userService } from "../../services/userService";
import { SecurityQuestion } from "../../models/SecurityQuestion";
import { UserSecurityAnswerView } from "../../models/UserSecurityAnswer";
import { User } from "../../models/User";
import Swal from "sweetalert2";
import answerService from "../../services/AnswerService";

const SecurityQuestionsBootstrap: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [allQuestions, setAllQuestions] = useState<SecurityQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserSecurityAnswerView[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // UI state para modal de respuestas (usuario)
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState<UserSecurityAnswerView | null>(null);
  const [answerForm, setAnswerForm] = useState({ security_question_id: 0, answer: "" });

  // UI state para modal de preguntas (catálogo)
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<SecurityQuestion | null>(null);
  const [questionForm, setQuestionForm] = useState({ name: "", description: "" });

  useEffect(() => {
    if (userId) fetchAll(parseInt(userId, 10));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchAll = async (id: number) => {
    try {
      setLoading(true);
      // usuario
      const u = await userService.getUserById(id);
      setUser(u ?? null);

      // preguntas y respuestas
      const questions = await securityQuestionService.getAllQuestions();
      const answers = await answerService.getAnswersByUser(id);
      setAllQuestions(questions);
      setUserAnswers(answers);
    } catch (err) {
      console.error("Error fetchAll:", err);
      Swal.fire("Error", "Ocurrió un error cargando datos (ver consola)", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------- helpers ----------
  const availableQuestionsForUser = () => {
    const answeredIds = userAnswers.map((a) => a.security_question_id);
    return allQuestions.filter((q) => typeof q.id === "number" && !answeredIds.includes(q.id!));
  };

  // ---------- Question (catalog) CRUD ----------
  const openCreateQuestion = () => {
    setEditingQuestion(null);
    setQuestionForm({ name: "", description: "" });
    setShowQuestionModal(true);
  };

  const openEditQuestion = (q: SecurityQuestion) => {
    setEditingQuestion(q);
    setQuestionForm({ name: q.name ?? "", description: q.description ?? "" });
    setShowQuestionModal(true);
  };

  const submitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionForm.name.trim()) {
      Swal.fire("Error", "El nombre de la pregunta es obligatorio", "error");
      return;
    }
    try {
      if (editingQuestion && editingQuestion.id) {
        const res = await securityQuestionService.updateQuestion(editingQuestion.id, questionForm);
        if (res) {
          Swal.fire("Actualizada", "Pregunta actualizada correctamente", "success");
        } else {
          Swal.fire("Error", "No se pudo actualizar la pregunta", "error");
        }
      } else {
        const res = await securityQuestionService.createQuestion(questionForm);
        if (res) {
          Swal.fire("Creada", "Pregunta creada correctamente", "success");
        } else {
          Swal.fire("Error", "No se pudo crear la pregunta", "error");
        }
      }
      setShowQuestionModal(false);
      // refrescar lista
      if (userId) await fetchAll(parseInt(userId, 10));
    } catch (err) {
      console.error("submitQuestion error:", err);
      Swal.fire("Error", "Ocurrió un error (ver consola)", "error");
    }
  };

  const handleDeleteQuestion = async (q: SecurityQuestion) => {
    if (!q.id) return;
    const ok = await Swal.fire({
      title: "Eliminar pregunta",
      text: `¿Seguro quieres eliminar la pregunta "${q.name}"? Esto eliminará también respuestas asociadas.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });
    if (ok.isConfirmed) {
      const success = await securityQuestionService.deleteQuestion(q.id);
      if (success) {
        Swal.fire("Eliminada", "Pregunta eliminada", "success");
        if (userId) fetchAll(parseInt(userId, 10));
      } else {
        Swal.fire("Error", "No se pudo eliminar la pregunta", "error");
      }
    }
  };

  // ---------- User answers ----------
  const openCreateAnswer = () => {
    setEditingAnswer(null);
    setAnswerForm({ security_question_id: 0, answer: "" });
    setShowAnswerModal(true);
  };

  const openEditAnswer = (ans: UserSecurityAnswerView) => {
    setEditingAnswer(ans);
    setAnswerForm({ security_question_id: ans.security_question_id, answer: "" }); // no mostrar texto real
    setShowAnswerModal(true);
  };

  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerForm.security_question_id || !answerForm.answer.trim()) {
      Swal.fire("Error", "Selecciona pregunta y escribe la respuesta", "error");
      return;
    }
    try {
      if (editingAnswer && editingAnswer.id) {
        const res = await answerService.updateAnswer(editingAnswer.id, answerForm.answer);
        if (res) Swal.fire("Actualizada", "Respuesta actualizada", "success");
        else Swal.fire("Error", "No se pudo actualizar respuesta", "error");
      } else {
        const payload = {
          user_id: parseInt(userId!, 10),
          security_question_id: answerForm.security_question_id,
          answer: answerForm.answer,
        };
        const res = await answerService.createAnswer(payload);
        if (res) Swal.fire("Creada", "Respuesta creada correctamente", "success");
        else Swal.fire("Error", "No se pudo crear la respuesta", "error");
      }
      setShowAnswerModal(false);
      if (userId) fetchAll(parseInt(userId, 10));
    } catch (err) {
      console.error("submitAnswer error:", err);
      Swal.fire("Error", "Ocurrió un error (ver consola)", "error");
    }
  };

  const handleDeleteAnswer = async (ans: UserSecurityAnswerView) => {
    const ok = await Swal.fire({
      title: "Eliminar respuesta",
      text: `¿Seguro quieres eliminar la respuesta a "${ans.question_name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });
    if (ok.isConfirmed && ans.id) {
      const success = await answerService.deleteAnswer(ans.id);
      if (success) {
        Swal.fire("Eliminada", "Respuesta eliminada", "success");
        if (userId) fetchAll(parseInt(userId, 10));
      } else {
        Swal.fire("Error", "No se pudo eliminar respuesta", "error");
      }
    }
  };

  // ---------- UI ----------
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
          <button className="btn btn-outline-secondary" onClick={() => navigate("/user/list")}>
            <i className="bi bi-arrow-left me-2"></i> Volver
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Left: Catálogo (CRUD preguntas) */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Catálogo de Preguntas</h5>
                <div>
                  <button className="btn btn-sm btn-primary" onClick={openCreateQuestion}>
                    <i className="bi bi-plus-lg me-1"></i> Nueva Pregunta
                  </button>
                </div>
              </div>

              {allQuestions.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-list-task fs-1 text-muted mb-2 d-block"></i>
                  <p className="text-muted">No hay preguntas en el catálogo. Crea la primera.</p>
                </div>
              ) : (
                <ul className="list-group">
                  {allQuestions.map((q) => (
                    <li key={q.id} className="list-group-item d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-semibold">{q.name}</div>
                        {q.description && <small className="text-muted d-block">{q.description}</small>}
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => openEditQuestion(q)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteQuestion(q)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Right: Respuestas del usuario */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Respuestas del Usuario</h5>
                <div>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={openCreateAnswer}
                    disabled={availableQuestionsForUser().length === 0}
                    title={availableQuestionsForUser().length === 0 ? "No hay preguntas disponibles" : "Agregar respuesta"}
                  >
                    <i className="bi bi-plus-lg me-1"></i> Agregar Respuesta
                  </button>
                </div>
              </div>

              {userAnswers.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-question-circle fs-1 text-muted mb-2 d-block"></i>
                  <p className="text-muted">Aún no hay respuestas configuradas.</p>
                  {availableQuestionsForUser().length > 0 && (
                    <button className="btn btn-primary btn-sm" onClick={openCreateAnswer}>
                      <i className="bi bi-plus-lg me-1"></i> Configurar Primera Respuesta
                    </button>
                  )}
                </div>
              ) : (
                <div className="list-group">
                  {userAnswers.map((ans) => (
                    <div key={ans.id} className="list-group-item d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-semibold">{ans.question_name}</div>
                        <small className="text-muted">Respuesta configurada</small>
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-warning" onClick={() => openEditAnswer(ans)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteAnswer(ans)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="card-footer bg-light">
              <small className="text-muted">
                {userAnswers.length} respuestas configuradas • {allQuestions.length} preguntas en catálogo
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Pregunta (crear/editar catálogo) */}
      {showQuestionModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <form className="modal-content" onSubmit={submitQuestion}>
              <div className="modal-header">
                <h5 className="modal-title">{editingQuestion ? "Editar Pregunta" : "Nueva Pregunta"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowQuestionModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre <span className="text-danger">*</span></label>
                  <input className="form-control" value={questionForm.name} onChange={(e) => setQuestionForm({ ...questionForm, name: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea className="form-control" value={questionForm.description} onChange={(e) => setQuestionForm({ ...questionForm, description: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowQuestionModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editingQuestion ? "Actualizar" : "Crear"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Respuesta (usuario) */}
      {showAnswerModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <form className="modal-content" onSubmit={submitAnswer}>
              <div className="modal-header">
                <h5 className="modal-title">{editingAnswer ? "Cambiar Respuesta" : "Nueva Respuesta"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowAnswerModal(false)}></button>
              </div>
              <div className="modal-body">
                {!editingAnswer && (
                  <div className="mb-3">
                    <label className="form-label">Pregunta <span className="text-danger">*</span></label>
                    <select className="form-select" value={answerForm.security_question_id} onChange={(e) => setAnswerForm({ ...answerForm, security_question_id: parseInt(e.target.value || "0", 10) })} required>
                      <option value={0}>Seleccionar...</option>
                      {availableQuestionsForUser().map((q) => (
                        <option key={q.id} value={q.id}>
                          {q.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {editingAnswer && (
                  <div className="mb-3">
                    <label className="form-label">Pregunta</label>
                    <p className="mb-2">{editingAnswer.question_name}</p>
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label">Respuesta <span className="text-danger">*</span></label>
                  <input className="form-control" value={answerForm.answer} onChange={(e) => setAnswerForm({ ...answerForm, answer: e.target.value })} required autoComplete="off" />
                  <small className="text-muted">No compartas esta respuesta con nadie.</small>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAnswerModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editingAnswer ? "Actualizar" : "Guardar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityQuestionsBootstrap;
