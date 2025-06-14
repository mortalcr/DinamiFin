import { useState, useEffect, useContext } from "react";
import { useUser } from "../context/UserContext";
import {
  FaExclamationCircle,
  FaTimes,
  FaCheck,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaTag,
  FaTrash,
  FaPlus,
  FaWallet,
  FaPiggyBank,
  FaChartLine,
  FaSpinner,
} from "react-icons/fa";

const API_BASE_URL = "http://localhost:8000";

const categories = {
  gasto: [
    "vivienda",
    "alimentación",
    "transporte",
    "salud",
    "educación",
    "entretenimiento",
    "ropa",
    "otros",
  ],
  ahorro: [
    "fondo de emergencia",
    "jubilación",
    "vacaciones",
    "mantenimiento",
    "otros",
  ],
  inversion: [
    "fondo de inversión",
    "acciones",
    "bienes raíces",
    "cripto",
    "negocio",
    "otros",
  ],
};

export const AddRecordForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  onDelete,
}) => {
  const [formData, setFormData] = useState({
    type: "gasto",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type,
        amount: initialData.amount.toString(),
        category: initialData.category,
        date: initialData.date.split("T")[0],
      });
    } else {
      setFormData({
        type: "gasto",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = "La fecha es obligatoria";
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.date)) {
        newErrors.date = "La fecha debe tener el formato YYYY-MM-DD";
      } else {
        const date = new Date(formData.date);
        if (isNaN(date.getTime())) {
          newErrors.date = "Ingrese una fecha válida";
        }
      }
    }

    if (!formData.amount) {
      newErrors.amount = "El monto es obligatorio";
    } else {
      const amount = Number.parseFloat(formData.amount);
      if (isNaN(amount)) {
        newErrors.amount = "Ingrese un monto válido";
      } else if (amount <= 0) {
        newErrors.amount = "El monto debe ser mayor que cero";
      }
    }

    if (!formData.category) {
      newErrors.category = "Debe seleccionar una categoría";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = {
        gasto: `${API_BASE_URL}/datos/gastos`,
        ahorro: `${API_BASE_URL}/datos/ahorros`,
        inversion: `${API_BASE_URL}/datos/inversiones`,
      }[formData.type];

      const amount = Math.round(Number.parseFloat(formData.amount) * 100) / 100;
      const formattedDate = new Date(formData.date).toISOString().split("T")[0];

      const requestBody = {
        amount: amount,
        category: formData.category,
      };

      switch (formData.type) {
        case "gasto":
          requestBody.expense_date = formattedDate;
          break;
        case "ahorro":
          requestBody.income_date = formattedDate;
          break;
        case "inversion":
          requestBody.investment_date = formattedDate;
          break;
      }

      console.log("Enviando datos:", {
        ...requestBody,
        endpoint: `${endpoint}/1`,
      });

      let response = await fetch(`${endpoint}/1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      let data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (!response.ok && data.detail && data.detail.includes("ya existe")) {
        console.log("Registro existente, intentando actualizar...");
        response = await fetch(`${endpoint}/1`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        data = await response.json();
        console.log("Respuesta de actualización:", data);

        if (!response.ok) {
          throw new Error(data.detail || "Error al actualizar el registro");
        }
      } else if (!response.ok) {
        const checkResponse = await fetch(`${endpoint}/1`);
        const checkData = await checkResponse.json();

        const recordExists = checkData.some((record) => {
          const recordDate =
            record.expense_date || record.income_date || record.investment_date;
          return (
            recordDate === formattedDate &&
            record.category === formData.category
          );
        });

        if (!recordExists) {
          throw new Error(data.detail || "Error al guardar el registro");
        }
      }

      const updatedData = {
        ...formData,
        amount: amount,
        date: formattedDate,
      };

      onSubmit(updatedData);

      await new Promise((resolve) => setTimeout(resolve, 500));

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        handleCancel();
      }, 2000);
    } catch (error) {
      console.error("Error completo:", error);
      setApiError(error.message || "Error al guardar el registro");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      onDelete();
    }
  };

  const handleCancel = () => {
    setFormData({
      type: "gasto",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
    });
    setErrors({});
    setApiError(null);
    onClose();
  };

  if (!isOpen) return null;

  const getTypeConfig = (type) => {
    switch (type) {
      case "gasto":
        return {
          color: "#E74C3C",
          bgColor: "bg-gradient-to-br from-[#E74C3C]/10 to-[#E74C3C]/5",
          icon: FaWallet,
          title: "Gasto",
          description: "Registra un nuevo gasto",
        };
      case "ahorro":
        return {
          color: "#2ECC71",
          bgColor: "bg-gradient-to-br from-[#2ECC71]/10 to-[#2ECC71]/5",
          icon: FaPiggyBank,
          title: "Ahorro",
          description: "Registra un nuevo ahorro",
        };
      case "inversion":
        return {
          color: "#F39C12",
          bgColor: "bg-gradient-to-br from-[#F39C12]/10 to-[#F39C12]/5",
          icon: FaChartLine,
          title: "Inversión",
          description: "Registra una nueva inversión",
        };
      default:
        return {
          color: "#1F3B4D",
          bgColor: "bg-gradient-to-br from-[#1F3B4D]/10 to-[#1F3B4D]/5",
          icon: FaPlus,
          title: "Registro",
          description: "Nuevo registro",
        };
    }
  };

  const typeConfig = getTypeConfig(formData.type);
  const IconComponent = typeConfig.icon;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in-0 duration-300">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-lg w-full border border-white/20 animate-in zoom-in-95 duration-300">
        {/* Header con gradiente */}
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
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1F3B4D]">
                  {initialData ? "Editar Registro" : "Agregar Nuevo Registro"}
                </h2>
                <p className="text-[#95A5A6] text-sm mt-1">
                  {initialData
                    ? "Modifica los detalles"
                    : "Completa los campos para agregar un registro"}
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="text-[#95A5A6] hover:text-[#1F3B4D] hover:bg-white/50 p-2 rounded-xl transition-all duration-200 hover:scale-110"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notificación de éxito */}
        {showSuccess && (
          <div className="mx-6 mt-6 p-4 bg-gradient-to-r from-[#2ECC71]/10 to-[#2ECC71]/5 border border-[#2ECC71]/20 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-500">
            <div className="p-2 bg-[#2ECC71]/20 rounded-lg">
              <FaCheck className="w-5 h-5 text-[#2ECC71]" />
            </div>
            <div>
              <p className="text-[#1F3B4D] font-medium">
                ¡Registro {initialData ? "actualizado" : "creado"} exitosamente!
              </p>
              <p className="text-[#2ECC71] text-sm">
                Se ha {initialData ? "actualizado" : "agregado"} el{" "}
                {formData.type} por $
                {Number.parseFloat(formData.amount).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Notificación de error */}
        {apiError && (
          <div className="mx-6 mt-6 p-4 bg-gradient-to-r from-[#E74C3C]/10 to-[#E74C3C]/5 border border-[#E74C3C]/20 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-500">
            <div className="p-2 bg-[#E74C3C]/20 rounded-lg">
              <FaExclamationCircle className="w-5 h-5 text-[#E74C3C]" />
            </div>
            <p className="text-[#E74C3C] font-medium">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Selector de tipo */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#1F3B4D] uppercase tracking-wide">
              Tipo de registro *
            </label>
            <div className="relative">
              <select
                value={formData.type}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    type: e.target.value,
                    category: "",
                  });
                  if (errors.type) {
                    setErrors((prev) => ({ ...prev, type: undefined }));
                  }
                }}
                className="w-full pl-12 pr-10 py-3 border border-[#F2F3F4] rounded-xl focus:ring-2 focus:ring-[#1F3B4D]/20 focus:border-[#1F3B4D] transition-all duration-200 text-[#1F3B4D] font-medium bg-white/50 backdrop-blur-sm cursor-pointer appearance-none"
                disabled={!!initialData}
              >
                <option value="gasto">Gasto</option>
                <option value="ahorro">Ahorro</option>
                <option value="inversion">Inversión</option>
              </select>
              <IconComponent className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#95A5A6] w-5 h-5" />
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
            {errors.type && (
              <div className="flex items-center gap-2 text-sm text-[#E74C3C] bg-[#E74C3C]/10 p-2 rounded-lg">
                <FaExclamationCircle className="w-4 h-4" />
                {errors.type}
              </div>
            )}
          </div>

          {/* Fecha */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#1F3B4D] uppercase tracking-wide">
              <FaCalendarAlt className="w-4 h-4" />
              Fecha *
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, date: e.target.value }));
                  if (errors.date) {
                    setErrors((prev) => ({ ...prev, date: undefined }));
                  }
                }}
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F3B4D]/20 focus:border-[#1F3B4D] transition-all duration-200 text-[#1F3B4D] font-medium bg-white/50 backdrop-blur-sm ${
                  errors.date ? "border-[#E74C3C]" : "border-[#F2F3F4]"
                }`}
                required
                disabled={!!initialData}
              />
              <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#95A5A6] w-4 h-4" />
            </div>
            {errors.date && (
              <div className="flex items-center gap-2 text-sm text-[#E74C3C] bg-[#E74C3C]/10 p-2 rounded-lg">
                <FaExclamationCircle className="w-4 h-4" />
                {errors.date}
              </div>
            )}
          </div>

          {/* Monto */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#1F3B4D] uppercase tracking-wide">
              <FaMoneyBillWave className="w-4 h-4" />
              Monto *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, amount: e.target.value }));
                  if (errors.amount) {
                    setErrors((prev) => ({ ...prev, amount: undefined }));
                  }
                }}
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F3B4D]/20 focus:border-[#1F3B4D] transition-all duration-200 text-[#1F3B4D] font-medium bg-white/50 backdrop-blur-sm ${
                  errors.amount ? "border-[#E74C3C]" : "border-[#F2F3F4]"
                }`}
                required
              />
              <FaMoneyBillWave className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#95A5A6] w-4 h-4" />
            </div>
            {errors.amount && (
              <div className="flex items-center gap-2 text-sm text-[#E74C3C] bg-[#E74C3C]/10 p-2 rounded-lg">
                <FaExclamationCircle className="w-4 h-4" />
                {errors.amount}
              </div>
            )}
          </div>

          {/* Categoría */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#1F3B4D] uppercase tracking-wide">
              <FaTag className="w-4 h-4" />
              Categoría *
            </label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }));
                  if (errors.category) {
                    setErrors((prev) => ({ ...prev, category: undefined }));
                  }
                }}
                className={`w-full pl-12 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F3B4D]/20 focus:border-[#1F3B4D] transition-all duration-200 text-[#1F3B4D] font-medium bg-white/50 backdrop-blur-sm cursor-pointer appearance-none ${
                  errors.category ? "border-[#E74C3C]" : "border-[#F2F3F4]"
                }`}
                required
              >
                <option value="">Selecciona una categoría</option>
                {categories[formData.type]?.map((category) => (
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
            {errors.category && (
              <div className="flex items-center gap-2 text-sm text-[#E74C3C] bg-[#E74C3C]/10 p-2 rounded-lg">
                <FaExclamationCircle className="w-4 h-4" />
                {errors.category}
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-6 border-t border-[#F2F3F4]">
            {initialData && (
              <button
                type="button"
                onClick={handleDelete}
                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E74C3C] to-[#E74C3C]/90 hover:from-[#E74C3C]/90 hover:to-[#E74C3C] text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
              >
                <FaTrash className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span>Eliminar</span>
              </button>
            )}

            <div className="flex gap-3 ml-auto">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-6 py-3 text-[#1F3B4D] hover:bg-[#F2F3F4]/50 rounded-xl transition-all duration-200 font-medium border border-[#F2F3F4] hover:border-[#1F3B4D]/20"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                style={{
                  background: `linear-gradient(135deg, ${typeConfig.color}, ${typeConfig.color}90)`,
                }}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <FaCheck className="w-4 h-4" />
                    <span>{initialData ? "Guardar Cambios" : "Guardar"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
