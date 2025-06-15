import { useState, useEffect, useContext } from "react";
import { useUser } from "../context/UserContext";
import {
  FaTimes,
  FaTrash,
  FaEdit,
  FaCalendarAlt,
  FaDollarSign,
  FaTag,
} from "react-icons/fa";

export const EditRecord = ({ isOpen, onClose, onSubmit, onDelete, record }) => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
  });

  useEffect(() => {
    if (!user || !user.id) {
      console.error('No hay usuario autenticado');
      onClose();
      return;
    }
  }, [user, onClose]);

  useEffect(() => {
    if (record) {
      setFormData({
        amount: record.amount.toString(),
        category: record.category,
      });
    }
  }, [record]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!user || !user.id) {
      console.error('No hay usuario autenticado');
      return;
    }
    
    onSubmit({
      ...record,
      userId: user.id, 
      amount: Number.parseFloat(formData.amount),
      category: formData.category,
      date: record.date.split("T")[0],
    });
  };

  const handleDelete = () => {
    if (!user || !user.id) {
      console.error('No hay usuario autenticado');
      return;
    }
    
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      onDelete({
        ...record,
        userId: user.id 
      });
    }
  };

  if (!isOpen || !record) return null;

  const getTypeConfig = (type) => {
    switch (type) {
      case "gasto":
        return {
          color: "#E74C3C",
          bgColor: "bg-gradient-to-br from-[#E74C3C]/10 to-[#E74C3C]/5",
          title: "Gasto",
          categories: [
            "vivienda",
            "alimentación",
            "transporte",
            "salud",
            "educación",
            "entretenimiento",
            "ropa",
            "otros",
          ],
        };
      case "ahorro":
        return {
          color: "#2ECC71",
          bgColor: "bg-gradient-to-br from-[#2ECC71]/10 to-[#2ECC71]/5",
          title: "Ahorro",
          categories: [
            "fondo de emergencia",
            "jubilación",
            "vacaciones",
            "mantenimiento",
            "otros",
          ],
        };
      case "inversion":
        return {
          color: "#F39C12",
          bgColor: "bg-gradient-to-br from-[#F39C12]/10 to-[#F39C12]/5",
          title: "Inversión",
          categories: [
            "fondo de inversión",
            "acciones",
            "bienes raíces",
            "cripto",
            "negocio",
            "otros",
          ],
        };
      default:
        return {
          color: "#1F3B4D",
          bgColor: "bg-gradient-to-br from-[#1F3B4D]/10 to-[#1F3B4D]/5",
          title: "Registro",
          categories: [],
        };
    }
  };

  const typeConfig = getTypeConfig(record.type);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in-0 duration-300">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-lg w-full border border-white/20 animate-in zoom-in-95 duration-300">
        
        <div
          className={`${typeConfig.bgColor} p-6 rounded-t-2xl border-b border-white/20`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div
                className="p-3 rounded-xl shadow-lg"
                style={{
                  backgroundColor: typeConfig.color + "20",
                  color: typeConfig.color,
                }}
              >
                <FaEdit className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1F3B4D]">
                  Editar {typeConfig.title}
                </h2>
                <p className="text-[#95A5A6] text-sm mt-1">
                  Modifica los detalles del registro
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-[#95A5A6] hover:text-[#1F3B4D] hover:bg-white/50 p-2 rounded-xl transition-all duration-200 hover:scale-110"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#1F3B4D] uppercase tracking-wide">
              <FaCalendarAlt className="w-4 h-4" />
              Fecha del Registro
            </label>
            <div className="relative">
              <input
                type="date"
                value={record.date}
                disabled
                className="w-full pl-12 pr-4 py-3 border border-[#F2F3F4] rounded-xl bg-gradient-to-r from-[#F2F3F4]/50 to-[#F2F3F4]/20 text-[#95A5A6] font-medium cursor-not-allowed"
              />
              <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#95A5A6] w-4 h-4" />
            </div>
            <p className="text-xs text-[#95A5A6] ml-1">
              La fecha no se puede modificar
            </p>
          </div>

          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#1F3B4D] uppercase tracking-wide">
              <FaDollarSign className="w-4 h-4" />
              Monto *
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full pl-12 pr-4 py-3 border border-[#F2F3F4] rounded-xl focus:ring-2 focus:ring-[#1F3B4D]/20 focus:border-[#1F3B4D] transition-all duration-200 text-[#1F3B4D] font-medium bg-white/50 backdrop-blur-sm"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
              <FaDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#95A5A6] w-4 h-4" />
            </div>
          </div>

          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#1F3B4D] uppercase tracking-wide">
              <FaTag className="w-4 h-4" />
              Categoría *
            </label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full pl-12 pr-10 py-3 border border-[#F2F3F4] rounded-xl focus:ring-2 focus:ring-[#1F3B4D]/20 focus:border-[#1F3B4D] transition-all duration-200 text-[#1F3B4D] font-medium bg-white/50 backdrop-blur-sm cursor-pointer appearance-none"
                required
              >
                <option value="">Seleccione una categoría</option>
                {typeConfig.categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                    className="capitalize"
                  >
                    {category}
                  </option>
                ))}
              </select>
              <FaTag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#95A5A6] w-4 h-4" />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#95A5A6]">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

      
          <div className="flex gap-3 pt-6 border-t border-[#F2F3F4]">
            <button
              type="button"
              onClick={handleDelete}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E74C3C] to-[#E74C3C]/90 hover:from-[#E74C3C]/90 hover:to-[#E74C3C] text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
            >
              <FaTrash className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span>Eliminar</span>
            </button>

            <div className="flex gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-[#1F3B4D] hover:bg-[#F2F3F4]/50 rounded-xl transition-all duration-200 font-medium border border-[#F2F3F4] hover:border-[#1F3B4D]/20"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-[#1F3B4D] to-[#1F3B4D]/90 hover:from-[#1F3B4D]/90 hover:to-[#1F3B4D] text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
