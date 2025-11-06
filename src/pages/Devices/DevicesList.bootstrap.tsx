// src/pages/Devices/DevicesList.bootstrap.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deviceService } from "../../services/deviceService";
import { userService } from "../../services/userService";
import { Device } from "../../models/Device";
import { User } from "../../models/User";
import Swal from "sweetalert2";

const DevicesListBootstrap: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [devices, setDevices] = useState<Device[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    ip: "",
    operating_system: "",
    is_active: true,
  });

  useEffect(() => {
    if (userId) {
      fetchData(parseInt(userId));
    }
  }, [userId]);

  const fetchData = async (id: number) => {
    try {
      setLoading(true);

      const userData = await userService.getUserById(id);
      if (!userData) {
        setError("Usuario no encontrado");
        setLoading(false);
        return;
      }
      setUser(userData);

      const devicesData = await deviceService.getDevicesByUserId(id);
      setDevices(devicesData);

      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setError("Error al cargar la información");
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/user/list");
  };

  const handleOpenModal = (device?: Device) => {
    if (device) {
      // Editar
      setEditingDevice(device);
      setFormData({
        name: device.name,
        ip: device.ip,
        operating_system: device.operating_system,
        is_active: device.is_active,
      });
    } else {
      // Crear nuevo
      setEditingDevice(null);
      setFormData({
        name: "",
        ip: "",
        operating_system: "",
        is_active: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDevice(null);
    setFormData({
      name: "",
      ip: "",
      operating_system: "",
      is_active: true,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.name || !formData.ip || !formData.operating_system) {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
      return;
    }

    try {
      let success;
      if (editingDevice) {
        // Actualizar
        success = await deviceService.updateDevice(editingDevice.id!, formData);
        if (success) {
          await Swal.fire("Actualizado", "Dispositivo actualizado correctamente", "success");
        }
      } else {
        // Crear
        success = await deviceService.createDevice({
          user_id: parseInt(userId!),
          ...formData,
        });
        if (success) {
          await Swal.fire("Creado", "Dispositivo registrado correctamente", "success");
        }
      }

      if (success) {
        handleCloseModal();
        fetchData(parseInt(userId!));
      } else {
        Swal.fire("Error", "No se pudo guardar el dispositivo", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Ocurrió un error al guardar", "error");
    }
  };

  const handleDelete = async (device: Device) => {
    const result = await Swal.fire({
      title: "Eliminar dispositivo",
      text: `¿Estás seguro de eliminar "${device.name}"? Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const success = await deviceService.deleteDevice(device.id!);
      if (success) {
        await Swal.fire("Eliminado", "El dispositivo ha sido eliminado", "success");
        fetchData(parseInt(userId!));
      } else {
        Swal.fire("Error", "No se pudo eliminar el dispositivo", "error");
      }
    }
  };

  const handleToggleActive = async (device: Device) => {
    const action = device.is_active ? "desactivar" : "activar";
    const result = await Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} dispositivo`,
      text: `¿Estás seguro de ${action} "${device.name}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const success = await deviceService.updateDevice(device.id!, {
        is_active: !device.is_active,
      });
      if (success) {
        await Swal.fire(
          action.charAt(0).toUpperCase() + action.slice(1),
          `El dispositivo ha sido ${action}do`,
          "success"
        );
        fetchData(parseInt(userId!));
      } else {
        Swal.fire("Error", `No se pudo ${action} el dispositivo`, "error");
      }
    }
  };

  const getDeviceIcon = (os: string): string => {
    const osLower = os.toLowerCase();
    if (osLower.includes("windows")) return "bi-windows";
    if (osLower.includes("mac") || osLower.includes("ios")) return "bi-apple";
    if (osLower.includes("android")) return "bi-android2";
    if (osLower.includes("linux")) return "bi-ubuntu";
    return "bi-laptop";
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="badge bg-success">
        <i className="bi bi-circle-fill me-1" style={{ fontSize: "0.5rem" }}></i>
        Activo
      </span>
    ) : (
      <span className="badge bg-secondary">
        <i className="bi bi-circle-fill me-1" style={{ fontSize: "0.5rem" }}></i>
        Inactivo
      </span>
    );
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

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Dispositivos Registrados</h2>
          <p className="text-muted mb-0">
            Usuario: <strong>{user?.name}</strong> ({user?.email})
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <i className="bi bi-plus-lg me-2"></i>
            Nuevo Dispositivo
          </button>
          <button className="btn btn-secondary" onClick={handleBack}>
            <i className="bi bi-arrow-left me-2"></i>
            Volver
          </button>
        </div>
      </div>

      {/* Cards de dispositivos */}
      {devices.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-laptop fs-1 text-muted mb-3 d-block"></i>
            <h5 className="text-muted">No hay dispositivos registrados</h5>
            <p className="text-muted mb-3">
              Este usuario aún no tiene dispositivos registrados.
            </p>
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <i className="bi bi-plus-lg me-2"></i>
              Registrar Primer Dispositivo
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {devices.map((device) => (
            <div key={device.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm device-card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                        style={{ width: "50px", height: "50px" }}
                      >
                        <i
                          className={`${getDeviceIcon(device.operating_system)} fs-3`}
                          style={{ color: device.is_active ? "#0d6efd" : "#6c757d" }}
                        ></i>
                      </div>
                      <div>
                        <h5 className="card-title mb-1">{device.name}</h5>
                        {getStatusBadge(device.is_active)}
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i className="bi bi-gear text-muted"></i>
                      <small className="text-muted">Sistema Operativo:</small>
                    </div>
                    <p className="mb-3 ps-4">{device.operating_system}</p>

                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i className="bi bi-router text-muted"></i>
                      <small className="text-muted">Dirección IP:</small>
                    </div>
                    <p className="mb-3 ps-4 font-monospace">{device.ip}</p>

                    {device.last_login && (
                      <>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <i className="bi bi-clock-history text-muted"></i>
                          <small className="text-muted">Último acceso:</small>
                        </div>
                        <p className="mb-0 ps-4">
                          {new Date(device.last_login).toLocaleString()}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="d-flex gap-2 mt-3">
                    <button
                      className="btn btn-sm btn-outline-primary flex-fill"
                      onClick={() => handleOpenModal(device)}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Editar
                    </button>
                    <button
                      className={`btn btn-sm ${
                        device.is_active ? "btn-outline-warning" : "btn-outline-success"
                      } flex-fill`}
                      onClick={() => handleToggleActive(device)}
                    >
                      <i
                        className={`bi ${
                          device.is_active ? "bi-pause-circle" : "bi-play-circle"
                        } me-1`}
                      ></i>
                      {device.is_active ? "Desactivar" : "Activar"}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(device)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>

                {device.created_at && (
                  <div className="card-footer bg-light">
                    <small className="text-muted">
                      <i className="bi bi-calendar3 me-1"></i>
                      Registrado: {new Date(device.created_at).toLocaleDateString()}
                    </small>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Información adicional */}
      {devices.length > 0 && (
        <div className="alert alert-info mt-4" role="alert">
          <i className="bi bi-info-circle me-2"></i>
          <strong>Total:</strong> {devices.length} | <strong>Activos:</strong>{" "}
          {devices.filter((d) => d.is_active).length} | <strong>Inactivos:</strong>{" "}
          {devices.filter((d) => !d.is_active).length}
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
                    {editingDevice ? "Editar Dispositivo" : "Nuevo Dispositivo"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">
                        Nombre del Dispositivo <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ej: iPhone 13 Pro"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Dirección IP <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control font-monospace"
                        name="ip"
                        value={formData.ip}
                        onChange={handleInputChange}
                        placeholder="192.168.1.100"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Sistema Operativo <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        name="operating_system"
                        value={formData.operating_system}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Windows 11">Windows 11</option>
                        <option value="Windows 10">Windows 10</option>
                        <option value="macOS Sonoma">macOS Sonoma</option>
                        <option value="macOS Ventura">macOS Ventura</option>
                        <option value="iOS 17">iOS 17</option>
                        <option value="iOS 16">iOS 16</option>
                        <option value="Android 14">Android 14</option>
                        <option value="Android 13">Android 13</option>
                        <option value="Ubuntu 22.04">Ubuntu 22.04</option>
                        <option value="Ubuntu 20.04">Ubuntu 20.04</option>
                      </select>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="is_active"
                        id="isActive"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="isActive">
                        Dispositivo activo
                      </label>
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
                      {editingDevice ? "Actualizar" : "Crear"}
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

export default DevicesListBootstrap;