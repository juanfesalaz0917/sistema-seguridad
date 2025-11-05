import React from "react";
import type { ProfileProps } from "./types";

const GenericProfileTailwind: React.FC<ProfileProps> = ({ data, onEdit }) => {
  return (
    <section className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-500 ease-in-out p-8 relative overflow-hidden border border-white/20">

        {/* Decorative Elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-transparent to-blue-400/10 rounded-3xl"></div>

        {/* Profile Image */}
        <div className="flex justify-center -mt-20 mb-6 relative z-10 mt-5">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-md group-hover:blur-lg transition-all duration-500"></div>
            <img
              className="w-40 h-40 object-cover rounded-full border-4 border-white/80 shadow-xl hover:scale-105 transform transition-all duration-400 relative z-10"
              src={data.avatarUrl ?? "/images/default-avatar.png"}
              alt="Profile Image"
            />
          </div>
        </div>

        {/* Name */}
        <div className="text-center mb-6 relative z-10">
          <h2 className="text-3xl font-bold text-black mb-2 tracking-tight">
            <span className="relative inline-block">
              {data.name}
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </span>
          </h2>
        </div>

        {/* Email y Teléfono */}
        <div className="text-center mb-8 relative z-10">
          <p className="text-black/80 text-lg mb-2"><span className="font-semibold">Email:</span> {data.email}</p>
          <p className="text-black/80 text-lg"><span className="font-semibold">Teléfono:</span> {data.phone ?? "No disponible"}</p>
        </div>

        {/* Botones Editar / Cerrar sesión */}
        <div className="mt-8 flex justify-center gap-4 relative z-10">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-black font-medium rounded-full shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
            >
              Editar Perfil
            </button>
          )}
        </div>

      </div>
    </section>
  );
};

export default GenericProfileTailwind;
