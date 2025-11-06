// src/components/UserForm/UserForm.bootstrap.tsx
import React from "react";
import { User } from "../../models/User";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface MyFormProps {
  mode: number; // 1 = crear, 2 = actualizar
  handleCreate?: (values: User) => void;
  handleUpdate?: (values: User) => void;
  user?: User | null;
}

const validationSchema = Yup.object({
  name: Yup.string().required("El nombre es obligatorio"),
  email: Yup.string().email("Email inválido").required("El email es obligatorio"),
  age: Yup.number()
    .typeError("Debe ser un número")
    .positive("Debe ser un número positivo")
    .integer("Debe ser un número entero")
    .required("La edad es obligatoria"),
  city: Yup.string().required("La ciudad es obligatoria"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "El teléfono debe tener 10 dígitos")
    .required("El teléfono es obligatorio"),
});

const UserFormBootstrap: React.FC<MyFormProps> = ({ mode, handleCreate, handleUpdate, user }) => {
  const handleSubmit = (formattedValues: User) => {
    if (mode === 1 && handleCreate) {
      handleCreate(formattedValues);
    } else if (mode === 2 && handleUpdate) {
      handleUpdate(formattedValues);
    } else {
      console.error("No function provided for the current mode");
    }
  };

  return (

      <Formik
        initialValues={
          user
            ? user
            : {
                name: "",
                email: "",
                age: "",
                city: "",
                phone: "",
                is_active: false,
              }
        }
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const formattedValues = { ...values, age: Number(values.age) } as User;
          handleSubmit(formattedValues);
        }}
      >
        {({ handleSubmit, touched, errors }) => (
          <Form onSubmit={handleSubmit} className="form-card">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <Field name="name">
                {({ field, meta }: any) => (
                  <input
                    {...field}
                    id="name"
                    type="text"
                    className={`form-control glow-input ${meta.touched && meta.error ? "is-invalid" : ""}`}
                    placeholder="Nombre completo"
                  />
                )}
              </Field>
              <ErrorMessage name="name">
                {(msg) => <div className="invalid-feedback d-block">{msg}</div>}
              </ErrorMessage>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <Field name="email">
                {({ field, meta }: any) => (
                  <input
                    {...field}
                    id="email"
                    type="email"
                    className={`form-control glow-input ${meta.touched && meta.error ? "is-invalid" : ""}`}
                    placeholder="usuario@ejemplo.com"
                  />
                )}
              </Field>
              <ErrorMessage name="email">
                {(msg) => <div className="invalid-feedback d-block">{msg}</div>}
              </ErrorMessage>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label htmlFor="age" className="form-label">
                  Age
                </label>
                <Field name="age">
                  {({ field, meta }: any) => (
                    <input
                      {...field}
                      id="age"
                      type="number"
                      className={`form-control glow-input ${meta.touched && meta.error ? "is-invalid" : ""}`}
                      placeholder="Edad"
                    />
                  )}
                </Field>
                <ErrorMessage name="age">
                  {(msg) => <div className="invalid-feedback d-block">{msg}</div>}
                </ErrorMessage>
              </div>

              <div className="col-md-4 mb-3">
                <label htmlFor="city" className="form-label">
                  City
                </label>
                <Field name="city">
                  {({ field, meta }: any) => (
                    <input
                      {...field}
                      id="city"
                      type="text"
                      className={`form-control glow-input ${meta.touched && meta.error ? "is-invalid" : ""}`}
                      placeholder="Ciudad"
                    />
                  )}
                </Field>
                <ErrorMessage name="city">
                  {(msg) => <div className="invalid-feedback d-block">{msg}</div>}
                </ErrorMessage>
              </div>

              <div className="col-md-4 mb-3">
                <label htmlFor="phone" className="form-label">
                  Phone
                </label>
                <Field name="phone">
                  {({ field, meta }: any) => (
                    <input
                      {...field}
                      id="phone"
                      type="text"
                      className={`form-control glow-input ${meta.touched && meta.error ? "is-invalid" : ""}`}
                      placeholder="10 dígitos"
                    />
                  )}
                </Field>
                <ErrorMessage name="phone">
                  {(msg) => <div className="invalid-feedback d-block">{msg}</div>}
                </ErrorMessage>
              </div>
            </div>

            <div className="form-check form-switch mb-3">
              <Field name="is_active">
                {({ field }: any) => (
                  <input
                    {...field}
                    id="is_active"
                    type="checkbox"
                    className="form-check-input"
                    checked={!!field.value}
                  />
                )}
              </Field>
              <label htmlFor="is_active" className="form-check-label ms-2">
                Active
              </label>
            </div>

            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary btn-lg">
                <i className="bi bi-check-lg me-2" /> {mode === 1 ? "Crear" : "Actualizar"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
  );
};

export default UserFormBootstrap;
