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
        setError("Usuario no encontrado");
        setLoading(false);
        return;
      }
      setUser(userData);

      // Obtener dispositivos del usuario
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

  const handleDeactivate = async (device: Device) => {
    const result = await Swal.fire({
      title: "Desactivar dispositivo",
      text: `¿Estás seguro de desactivar "${device.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const success = await deviceService.deactivateDevice(device.id!);
      if (success) {
        await Swal.fire("Desactivado", "El dispositivo ha sido desactivado", "success");
        fetchData(parseInt(userId!));
      } else {
        Swal.fire("Error", "No se pudo desactivar el dispositivo", "error");
      }
    }
  };

  // Función para obtener el icono según el sistema operativo
  const getDeviceIcon = (os: string): string => {
    const osLower = os.toLowerCase();
    if (osLower.includes("windows")) return "bi-windows";
    if (osLower.includes("mac") || osLower.includes("ios")) return "bi-apple";
    if (osLower.includes("android")) return "bi-android2";
    if (osLower.includes("linux")) return "bi-ubuntu";
    return "bi-laptop";
  };

  // Función para obtener el color del badge según el estado
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
        <button className="btn btn-secondary" onClick={handleBack}>
          <i className="bi bi-arrow-left me-2"></i>
          Volver
        </button>
      </div>

      {/* Cards de dispositivos */}
      {devices.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-laptop fs-1 text-muted mb-3 d-block"></i>
            <h5 className="text-muted">No hay dispositivos registrados</h5>
            <p className="text-muted mb-0">
              Este usuario aún no ha iniciado sesión desde ningún dispositivo.
            </p>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {devices.map((device) => (
            <div key={device.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm device-card">
                <div className="card-body">
                  {/* Header del card con icono y estado */}
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

                  {/* Información del dispositivo */}
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

                  {/* Botón de acción */}
                  {device.is_active && (
                    <div className="d-grid mt-3">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeactivate(device)}
                      >
                        <i className="bi bi-x-circle me-2"></i>
                        Desactivar Dispositivo
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer con fecha de registro */}
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
          <strong>Total de dispositivos:</strong> {devices.length} 
          {" | "}
          <strong>Activos:</strong> {devices.filter(d => d.is_active).length}
          {" | "}
          <strong>Inactivos:</strong> {devices.filter(d => !d.is_active).length}
        </div>
      )}
    </div>
  );
};

export default DevicesListBootstrap;